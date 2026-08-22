import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Dayflow HR procedure access", () => {
  it("blocks unauthenticated callers from employee HR data", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.hr.myDashboard()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks employee accounts from Admin / HR procedures", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 99,
      openId: "employee-only",
      name: "Employee Only",
      email: "employee@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.hr.adminOverview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
