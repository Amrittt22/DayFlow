import { describe, expect, it } from "vitest";
import { hrRequestCreateInput, hrRequestUpdateInput } from "./hrSchemas";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const adminContext: TrpcContext = {
  user: { id: 1, openId: "admin", name: "Admin", email: "admin@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("Dayflow HR request contracts", () => {
  it("accepts a bounded employee request", () => {
    expect(hrRequestCreateInput.safeParse({ requestType: "document", priority: "standard", subject: "Employment letter", details: "Please provide an employment confirmation letter." }).success).toBe(true);
  });

  it("accepts a bounded Admin / HR status update", () => {
    expect(hrRequestUpdateInput.safeParse({ requestId: 1, status: "in_progress", resolution: "Reviewing the request now." }).success).toBe(true);
  });

  it("blocks employee accounts from the Admin / HR request queue", async () => {
    const caller = appRouter.createCaller({ ...adminContext, user: { ...adminContext.user!, role: "user" } });
    await expect(caller.hr.adminRequests()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
