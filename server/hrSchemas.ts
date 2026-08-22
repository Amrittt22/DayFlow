import { z } from "zod";

export const leaveRequestInput = z
  .object({
    leaveType: z.enum(["paid", "sick", "unpaid"]),
    startAt: z.number().int().positive(),
    endAt: z.number().int().positive(),
    note: z.string().trim().max(1000).optional(),
  })
  .refine(({ startAt, endAt }) => endAt >= startAt, {
    message: "The leave end date must be on or after the start date.",
    path: ["endAt"],
  });

export const profileUpdateInput = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(500).optional(),
});

export const leaveReviewInput = z.object({
  leaveRequestId: z.number().int().positive(),
  status: z.enum(["approved", "rejected"]),
  comment: z.string().trim().max(1000).optional(),
});

export const payrollUpsertInput = z.object({
  employeeId: z.number().int().positive(),
  periodStartAt: z.number().int().positive(),
  grossPayCents: z.number().int().min(0),
  netPayCents: z.number().int().min(0),
  currency: z.string().trim().length(3).transform(value => value.toUpperCase()),
  paymentStatus: z.enum(["draft", "finalized"]),
});

export const announcementCreateInput = z.object({
  title: z.string().trim().min(3).max(140),
  body: z.string().trim().min(1).max(2000),
  audience: z.enum(["all", "employees", "admins"]),
  isPinned: z.boolean().default(false),
});

export const announcementReadInput = z.object({
  announcementId: z.number().int().positive(),
});

export const hrRequestCreateInput = z.object({
  requestType: z.enum(["document", "access", "policy", "support"]),
  priority: z.enum(["standard", "high"]),
  subject: z.string().trim().min(3).max(160),
  details: z.string().trim().min(5).max(1200),
});

export const hrRequestUpdateInput = z.object({
  requestId: z.number().int().positive(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
  resolution: z.string().trim().max(1200).optional(),
});
