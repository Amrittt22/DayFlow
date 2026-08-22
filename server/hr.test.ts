import { describe, expect, it } from "vitest";
import { leaveRequestInput, leaveReviewInput, payrollUpsertInput } from "./hrSchemas";

describe("Dayflow HR request validation", () => {
  it("accepts an ordered leave interval", () => {
    const result = leaveRequestInput.safeParse({
      leaveType: "paid",
      startAt: 1_746_144_000_000,
      endAt: 1_746_316_800_000,
      note: "Family time",
    });
    expect(result.success).toBe(true);
  });

  it("rejects leave intervals that end before they begin", () => {
    const result = leaveRequestInput.safeParse({
      leaveType: "sick",
      startAt: 1_746_316_800_000,
      endAt: 1_746_144_000_000,
    });
    expect(result.success).toBe(false);
  });

  it("only permits final HR review outcomes", () => {
    expect(leaveReviewInput.safeParse({ leaveRequestId: 8, status: "approved" }).success).toBe(true);
    expect(leaveReviewInput.safeParse({ leaveRequestId: 8, status: "pending" }).success).toBe(false);
  });

  it("normalizes payroll currency and preserves non-negative pay values", () => {
    const result = payrollUpsertInput.parse({
      employeeId: 2,
      periodStartAt: 1_746_144_000_000,
      grossPayCents: 500_000,
      netPayCents: 410_000,
      currency: "usd",
      paymentStatus: "draft",
    });
    expect(result.currency).toBe("USD");
  });
});
