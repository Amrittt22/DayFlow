import { describe, expect, it } from "vitest";
import { announcementCreateInput, announcementReadInput } from "./hrSchemas";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const adminContext: TrpcContext = {
  user: { id: 1, openId: "admin", name: "Admin", email: "admin@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("Dayflow feature tool validation", () => {
  it("accepts a bounded announcement payload", () => {
    const result = announcementCreateInput.safeParse({ title: "Office update", body: "The workspace opens at 9 AM.", audience: "all", isPinned: true });
    expect(result.success).toBe(true);
  });

  it("rejects announcement actions without a valid identifier", () => {
    expect(announcementReadInput.safeParse({ announcementId: 0 }).success).toBe(false);
  });

  it("blocks employee callers from payroll record access", async () => {
    const caller = appRouter.createCaller({ ...adminContext, user: { ...adminContext.user!, role: "user" } });
    await expect(caller.hr.listPayrollRecords()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks employee callers from publishing announcements", async () => {
    const caller = appRouter.createCaller({ ...adminContext, user: { ...adminContext.user!, role: "user" } });
    await expect(caller.hr.createAnnouncement({ title: "Team update", body: "Please read this.", audience: "all", isPinned: false })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
