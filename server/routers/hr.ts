import { TRPCError } from "@trpc/server";
import {
  createHrRequest,
  createAnnouncement,
  adminGetOverview,
  checkInForUser,
  checkOutForUser,
  getEmployeeDirectory,
  getMyDashboard,
  listAdminHrRequests,
  listAnnouncementsForUser,
  listPayrollRecords,
  markAnnouncementRead,
  requestLeaveForUser,
  reviewLeaveRequest,
  listMyHrRequests,
  updateHrRequest,
  updateMyProfile,
  upsertPayrollRecord,
} from "../db";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import { announcementCreateInput, announcementReadInput, hrRequestCreateInput, hrRequestUpdateInput, leaveRequestInput, leaveReviewInput, payrollUpsertInput, profileUpdateInput } from "../hrSchemas";

export const hrRouter = router({
  myDashboard: protectedProcedure.query(({ ctx }) => getMyDashboard(ctx.user)),
  checkIn: protectedProcedure.mutation(({ ctx }) => checkInForUser(ctx.user)),
  checkOut: protectedProcedure.mutation(({ ctx }) => checkOutForUser(ctx.user)),
  requestLeave: protectedProcedure.input(leaveRequestInput).mutation(({ ctx, input }) => requestLeaveForUser(ctx.user, input)),
  updateMyProfile: protectedProcedure.input(profileUpdateInput).mutation(({ ctx, input }) => updateMyProfile(ctx.user, input)),
  myAnnouncements: protectedProcedure.query(({ ctx }) => listAnnouncementsForUser(ctx.user)),
  markAnnouncementRead: protectedProcedure.input(announcementReadInput).mutation(({ ctx, input }) => markAnnouncementRead(ctx.user, input.announcementId)),
  myRequests: protectedProcedure.query(({ ctx }) => listMyHrRequests(ctx.user)),
  createRequest: protectedProcedure.input(hrRequestCreateInput).mutation(({ ctx, input }) => createHrRequest(ctx.user, input)),

  adminOverview: adminProcedure.query(() => adminGetOverview()),
  listEmployees: adminProcedure.query(() => getEmployeeDirectory()),
  listPayrollRecords: adminProcedure.query(() => listPayrollRecords()),
  createAnnouncement: adminProcedure.input(announcementCreateInput).mutation(({ ctx, input }) => createAnnouncement(ctx.user.id, input)),
  adminRequests: adminProcedure.query(() => listAdminHrRequests()),
  updateRequest: adminProcedure.input(hrRequestUpdateInput).mutation(({ ctx, input }) => updateHrRequest(ctx.user.id, input)),
  reviewLeave: adminProcedure.input(leaveReviewInput).mutation(({ ctx, input }) => reviewLeaveRequest(ctx.user.id, input)),
  upsertPayroll: adminProcedure.input(payrollUpsertInput).mutation(async ({ input }) => {
    if (input.netPayCents > input.grossPayCents) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Net pay cannot exceed gross pay." });
    }
    return upsertPayrollRecord(input);
  }),
});
