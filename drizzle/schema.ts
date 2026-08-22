import { bigint, boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const employeeProfiles = mysqlTable(
  "employee_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    employeeCode: varchar("employeeCode", { length: 32 }).notNull(),
    fullName: varchar("fullName", { length: 120 }).notNull(),
    department: varchar("department", { length: 120 }),
    jobTitle: varchar("jobTitle", { length: 120 }),
    phone: varchar("phone", { length: 40 }),
    address: text("address"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("employee_profiles_user_unique").on(table.userId),
    uniqueIndex("employee_profiles_code_unique").on(table.employeeCode),
    index("employee_profiles_department_idx").on(table.department),
  ],
);

export const attendanceEntries = mysqlTable(
  "attendance_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    employeeId: int("employeeId").notNull().references(() => employeeProfiles.id, { onDelete: "cascade" }),
    workDate: bigint("workDate", { mode: "number" }).notNull(),
    checkInAt: bigint("checkInAt", { mode: "number" }),
    checkOutAt: bigint("checkOutAt", { mode: "number" }),
    status: mysqlEnum("status", ["present", "absent", "half_day", "leave"]).default("present").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("attendance_employee_day_unique").on(table.employeeId, table.workDate),
    index("attendance_work_date_idx").on(table.workDate),
  ],
);

export const leaveRequests = mysqlTable(
  "leave_requests",
  {
    id: int("id").autoincrement().primaryKey(),
    employeeId: int("employeeId").notNull().references(() => employeeProfiles.id, { onDelete: "cascade" }),
    leaveType: mysqlEnum("leaveType", ["paid", "sick", "unpaid"]).notNull(),
    startAt: bigint("startAt", { mode: "number" }).notNull(),
    endAt: bigint("endAt", { mode: "number" }).notNull(),
    note: text("note"),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
    reviewerId: int("reviewerId").references(() => users.id, { onDelete: "set null" }),
    reviewerComment: text("reviewerComment"),
    reviewedAt: bigint("reviewedAt", { mode: "number" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("leave_requests_employee_idx").on(table.employeeId),
    index("leave_requests_status_idx").on(table.status),
  ],
);

export const payrollRecords = mysqlTable(
  "payroll_records",
  {
    id: int("id").autoincrement().primaryKey(),
    employeeId: int("employeeId").notNull().references(() => employeeProfiles.id, { onDelete: "cascade" }),
    periodStartAt: bigint("periodStartAt", { mode: "number" }).notNull(),
    grossPayCents: int("grossPayCents").notNull(),
    netPayCents: int("netPayCents").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    paymentStatus: mysqlEnum("paymentStatus", ["draft", "finalized"]).default("draft").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("payroll_employee_period_unique").on(table.employeeId, table.periodStartAt),
    index("payroll_period_idx").on(table.periodStartAt),
  ],
);

export const announcements = mysqlTable(
  "announcements",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    body: text("body").notNull(),
    audience: mysqlEnum("audience", ["all", "employees", "admins"]).default("all").notNull(),
    isPinned: boolean("isPinned").default(false).notNull(),
    authorUserId: int("authorUserId").references(() => users.id, { onDelete: "set null" }),
    publishedAt: bigint("publishedAt", { mode: "number" }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("announcements_audience_idx").on(table.audience), index("announcements_published_idx").on(table.publishedAt)],
);

export const announcementReads = mysqlTable(
  "announcement_reads",
  {
    id: int("id").autoincrement().primaryKey(),
    announcementId: int("announcementId").notNull().references(() => announcements.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    readAt: bigint("readAt", { mode: "number" }).notNull(),
  },
  table => [uniqueIndex("announcement_reads_unique").on(table.announcementId, table.userId), index("announcement_reads_user_idx").on(table.userId)],
);

export const hrRequests = mysqlTable(
  "hr_requests",
  {
    id: int("id").autoincrement().primaryKey(),
    employeeId: int("employeeId").notNull().references(() => employeeProfiles.id, { onDelete: "cascade" }),
    requestType: mysqlEnum("requestType", ["document", "access", "policy", "support"]).notNull(),
    priority: mysqlEnum("priority", ["standard", "high"]).default("standard").notNull(),
    subject: varchar("subject", { length: 160 }).notNull(),
    details: text("details").notNull(),
    status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
    assignedAdminId: int("assignedAdminId").references(() => users.id, { onDelete: "set null" }),
    resolution: text("resolution"),
    resolvedAt: bigint("resolvedAt", { mode: "number" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("hr_requests_employee_idx").on(table.employeeId), index("hr_requests_status_idx").on(table.status), index("hr_requests_created_idx").on(table.createdAt)],
);

export type EmployeeProfile = typeof employeeProfiles.$inferSelect;
export type AttendanceEntry = typeof attendanceEntries.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type HrRequest = typeof hrRequests.$inferSelect;
