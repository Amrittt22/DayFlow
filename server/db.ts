import { and, desc, eq, gte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { announcementReads, announcements, attendanceEntries, employeeProfiles, hrRequests, InsertUser, leaveRequests, payrollRecords, type User, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import type { z } from "zod";
import type { announcementCreateInput, hrRequestCreateInput, hrRequestUpdateInput, leaveRequestInput, leaveReviewInput, payrollUpsertInput, profileUpdateInput } from "./hrSchemas";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("The Dayflow database is temporarily unavailable.");
  return db;
}

function startOfUtcDay(timestamp = Date.now()) {
  const date = new Date(timestamp);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export async function getOrCreateEmployeeProfile(user: User) {
  const db = await requireDb();
  const [existing] = await db.select().from(employeeProfiles).where(eq(employeeProfiles.userId, user.id)).limit(1);
  if (existing) return existing;

  const fullName = user.name?.trim() || user.email?.split("@")[0] || "Dayflow teammate";
  await db.insert(employeeProfiles).values({
    userId: user.id,
    employeeCode: `DF-${String(user.id).padStart(5, "0")}`,
    fullName,
    department: "Not assigned",
    jobTitle: user.role === "admin" ? "HR administrator" : "Team member",
  });
  const [profile] = await db.select().from(employeeProfiles).where(eq(employeeProfiles.userId, user.id)).limit(1);
  if (!profile) throw new Error("Dayflow could not create your employee profile.");
  return profile;
}

export async function getMyDashboard(user: User) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  const weekStart = startOfUtcDay(Date.now() - 6 * 24 * 60 * 60 * 1000);
  const [attendance, leaveRequestRows, payroll] = await Promise.all([
    db.select().from(attendanceEntries).where(and(eq(attendanceEntries.employeeId, employee.id), gte(attendanceEntries.workDate, weekStart))).orderBy(desc(attendanceEntries.workDate)),
    db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employee.id)).orderBy(desc(leaveRequests.createdAt)).limit(6),
    db.select().from(payrollRecords).where(eq(payrollRecords.employeeId, employee.id)).orderBy(desc(payrollRecords.periodStartAt)).limit(1),
  ]);
  return { employee, attendance, leaveRequests: leaveRequestRows, latestPayroll: payroll[0] ?? null };
}

export async function checkInForUser(user: User) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  const workDate = startOfUtcDay();
  const now = Date.now();
  const [existing] = await db.select().from(attendanceEntries).where(and(eq(attendanceEntries.employeeId, employee.id), eq(attendanceEntries.workDate, workDate))).limit(1);
  if (existing?.checkOutAt) throw new Error("Today’s attendance entry is already complete.");
  if (existing?.checkInAt) throw new Error("You are already checked in for today.");
  if (existing) {
    await db.update(attendanceEntries).set({ checkInAt: now, status: "present" }).where(eq(attendanceEntries.id, existing.id));
  } else {
    await db.insert(attendanceEntries).values({ employeeId: employee.id, workDate, checkInAt: now, status: "present" });
  }
  return { success: true } as const;
}

export async function checkOutForUser(user: User) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  const workDate = startOfUtcDay();
  const [entry] = await db.select().from(attendanceEntries).where(and(eq(attendanceEntries.employeeId, employee.id), eq(attendanceEntries.workDate, workDate))).limit(1);
  if (!entry?.checkInAt) throw new Error("Check in before recording a check-out time.");
  if (entry.checkOutAt) throw new Error("You have already checked out for today.");
  await db.update(attendanceEntries).set({ checkOutAt: Date.now(), status: "present" }).where(eq(attendanceEntries.id, entry.id));
  return { success: true } as const;
}

export async function requestLeaveForUser(user: User, input: z.infer<typeof leaveRequestInput>) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  await db.insert(leaveRequests).values({ employeeId: employee.id, ...input, note: input.note || null, status: "pending" });
  return { success: true } as const;
}

export async function updateMyProfile(user: User, input: z.infer<typeof profileUpdateInput>) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  await db.update(employeeProfiles).set(input).where(eq(employeeProfiles.id, employee.id));
  return { success: true } as const;
}

export async function getEmployeeDirectory() {
  const db = await requireDb();
  return db.select({ id: employeeProfiles.id, employeeCode: employeeProfiles.employeeCode, fullName: employeeProfiles.fullName, department: employeeProfiles.department, jobTitle: employeeProfiles.jobTitle, active: employeeProfiles.active, email: users.email }).from(employeeProfiles).innerJoin(users, eq(employeeProfiles.userId, users.id)).orderBy(desc(employeeProfiles.createdAt));
}

export async function adminGetOverview() {
  const db = await requireDb();
  const today = startOfUtcDay();
  const [directory, presentRows, pendingLeaveRequests] = await Promise.all([
    getEmployeeDirectory(),
    db.select({ id: attendanceEntries.id }).from(attendanceEntries).where(and(eq(attendanceEntries.workDate, today), eq(attendanceEntries.status, "present"))),
    db.select({ id: leaveRequests.id, leaveType: leaveRequests.leaveType, startAt: leaveRequests.startAt, endAt: leaveRequests.endAt, note: leaveRequests.note, employeeName: employeeProfiles.fullName, employeeCode: employeeProfiles.employeeCode }).from(leaveRequests).innerJoin(employeeProfiles, eq(leaveRequests.employeeId, employeeProfiles.id)).where(eq(leaveRequests.status, "pending")).orderBy(desc(leaveRequests.createdAt)).limit(20),
  ]);
  return { teamCount: directory.length, presentToday: presentRows.length, pendingLeaveRequests, employees: directory.slice(0, 8) };
}

export async function reviewLeaveRequest(reviewerId: number, input: z.infer<typeof leaveReviewInput>) {
  const db = await requireDb();
  const [request] = await db.select({ id: leaveRequests.id, status: leaveRequests.status }).from(leaveRequests).where(eq(leaveRequests.id, input.leaveRequestId)).limit(1);
  if (!request) throw new Error("The leave request could not be found.");
  if (request.status !== "pending") throw new Error("This leave request has already been reviewed.");
  await db.update(leaveRequests).set({ status: input.status, reviewerId, reviewerComment: input.comment || null, reviewedAt: Date.now() }).where(eq(leaveRequests.id, request.id));
  return { success: true } as const;
}

export async function upsertPayrollRecord(input: z.infer<typeof payrollUpsertInput>) {
  const db = await requireDb();
  const [employee] = await db.select({ id: employeeProfiles.id }).from(employeeProfiles).where(eq(employeeProfiles.id, input.employeeId)).limit(1);
  if (!employee) throw new Error("The employee profile could not be found.");
  await db.insert(payrollRecords).values(input).onDuplicateKeyUpdate({ set: input });
  return { success: true } as const;
}

export async function listPayrollRecords() {
  const db = await requireDb();
  return db.select({ id: payrollRecords.id, periodStartAt: payrollRecords.periodStartAt, grossPayCents: payrollRecords.grossPayCents, netPayCents: payrollRecords.netPayCents, currency: payrollRecords.currency, paymentStatus: payrollRecords.paymentStatus, employeeId: employeeProfiles.id, employeeName: employeeProfiles.fullName, employeeCode: employeeProfiles.employeeCode }).from(payrollRecords).innerJoin(employeeProfiles, eq(payrollRecords.employeeId, employeeProfiles.id)).orderBy(desc(payrollRecords.periodStartAt));
}

export async function listAnnouncementsForUser(user: User) {
  const db = await requireDb();
  const audienceCondition = user.role === "admin" ? undefined : or(eq(announcements.audience, "all"), eq(announcements.audience, "employees"));
  return db.select({ id: announcements.id, title: announcements.title, body: announcements.body, audience: announcements.audience, isPinned: announcements.isPinned, publishedAt: announcements.publishedAt, authorName: users.name, readAt: announcementReads.readAt }).from(announcements).leftJoin(users, eq(announcements.authorUserId, users.id)).leftJoin(announcementReads, and(eq(announcementReads.announcementId, announcements.id), eq(announcementReads.userId, user.id))).where(audienceCondition).orderBy(desc(announcements.isPinned), desc(announcements.publishedAt));
}

export async function createAnnouncement(authorUserId: number, input: z.infer<typeof announcementCreateInput>) {
  const db = await requireDb();
  await db.insert(announcements).values({ ...input, authorUserId, publishedAt: Date.now() });
  return { success: true } as const;
}

export async function markAnnouncementRead(user: User, announcementId: number) {
  const visible = await listAnnouncementsForUser(user);
  if (!visible.some(announcement => announcement.id === announcementId)) throw new Error("This announcement is not available to your role.");
  const db = await requireDb();
  await db.insert(announcementReads).values({ announcementId, userId: user.id, readAt: Date.now() }).onDuplicateKeyUpdate({ set: { readAt: Date.now() } });
  return { success: true } as const;
}

export async function listMyHrRequests(user: User) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  return db.select({ id: hrRequests.id, requestType: hrRequests.requestType, priority: hrRequests.priority, subject: hrRequests.subject, details: hrRequests.details, status: hrRequests.status, resolution: hrRequests.resolution, createdAt: hrRequests.createdAt, updatedAt: hrRequests.updatedAt }).from(hrRequests).where(eq(hrRequests.employeeId, employee.id)).orderBy(desc(hrRequests.createdAt));
}

export async function listAdminHrRequests() {
  const db = await requireDb();
  return db.select({ id: hrRequests.id, requestType: hrRequests.requestType, priority: hrRequests.priority, subject: hrRequests.subject, details: hrRequests.details, status: hrRequests.status, resolution: hrRequests.resolution, createdAt: hrRequests.createdAt, employeeName: employeeProfiles.fullName, employeeCode: employeeProfiles.employeeCode }).from(hrRequests).innerJoin(employeeProfiles, eq(hrRequests.employeeId, employeeProfiles.id)).orderBy(desc(hrRequests.createdAt));
}

export async function createHrRequest(user: User, input: z.infer<typeof hrRequestCreateInput>) {
  const db = await requireDb();
  const employee = await getOrCreateEmployeeProfile(user);
  await db.insert(hrRequests).values({ employeeId: employee.id, ...input, status: "open" });
  return { success: true } as const;
}

export async function updateHrRequest(adminUserId: number, input: z.infer<typeof hrRequestUpdateInput>) {
  const db = await requireDb();
  const [request] = await db.select({ id: hrRequests.id, resolution: hrRequests.resolution }).from(hrRequests).where(eq(hrRequests.id, input.requestId)).limit(1);
  if (!request) throw new Error("The HR request could not be found.");
  const effectiveResolution = input.resolution?.trim() || request.resolution?.trim();
  if (input.status === "resolved" && !effectiveResolution) throw new Error("Add a response before resolving this request.");
  const values: { status: typeof input.status; assignedAdminId: number; resolvedAt: number | null; resolution?: string | null } = { status: input.status, assignedAdminId: adminUserId, resolvedAt: input.status === "resolved" || input.status === "closed" ? Date.now() : null };
  if (input.resolution !== undefined) values.resolution = input.resolution.trim() || null;
  await db.update(hrRequests).set(values).where(eq(hrRequests.id, request.id));
  return { success: true } as const;
}
