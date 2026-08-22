import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { WorkdayOrbit, WorkdayRail } from "@/components/DayflowMotion";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Check, Clock3, FileText, Loader2, PencilLine, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const leaveTypes = ["paid", "sick", "unpaid"] as const;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function getTodayInput() {
  return new Date().toISOString().slice(0, 10);
}

function dayToUtc(value: string) {
  return Date.parse(`${value}T00:00:00.000Z`);
}

export default function AppDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const dashboard = trpc.hr.myDashboard.useQuery(undefined, { enabled: isAuthenticated });
  const adminOverview = trpc.hr.adminOverview.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [leaveType, setLeaveType] = useState<(typeof leaveTypes)[number]>("paid");
  const [leaveStart, setLeaveStart] = useState(getTodayInput);
  const [leaveEnd, setLeaveEnd] = useState(getTodayInput);
  const [leaveNote, setLeaveNote] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const refresh = async () => {
    await Promise.all([utils.hr.myDashboard.invalidate(), utils.hr.adminOverview.invalidate()]);
  };

  const checkIn = trpc.hr.checkIn.useMutation({ onSuccess: async () => { await refresh(); toast.success("Checked in", { description: "Your attendance record is now live." }); }, onError: error => toast.error(error.message) });
  const checkOut = trpc.hr.checkOut.useMutation({ onSuccess: async () => { await refresh(); toast.success("Checked out", { description: "Your attendance record has been updated." }); }, onError: error => toast.error(error.message) });
  const requestLeave = trpc.hr.requestLeave.useMutation({ onSuccess: async () => { await refresh(); setShowLeaveForm(false); setLeaveNote(""); toast.success("Leave request sent", { description: "The request is now in the HR approval queue." }); }, onError: error => toast.error(error.message) });
  const saveProfile = trpc.hr.updateMyProfile.useMutation({ onSuccess: async () => { await refresh(); setShowProfileForm(false); toast.success("Profile updated", { description: "Your contact details are securely saved." }); }, onError: error => toast.error(error.message) });
  const reviewLeave = trpc.hr.reviewLeave.useMutation({ onSuccess: async () => { await refresh(); toast.success("Leave decision saved", { description: "The employee’s record has been updated." }); }, onError: error => toast.error(error.message) });

  const submitLeave = (event: FormEvent) => {
    event.preventDefault();
    requestLeave.mutate({ leaveType, startAt: dayToUtc(leaveStart), endAt: dayToUtc(leaveEnd), note: leaveNote || undefined });
  };

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    saveProfile.mutate({ phone: phone || undefined, address: address || undefined });
  };

  if (loading || dashboard.isLoading) {
    return <DashboardLayout><div className="grid min-h-[70vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-[#c98708]" /></div></DashboardLayout>;
  }

  const data = dashboard.data;
  if (!data) {
    return <DashboardLayout><div className="paper-card mt-4 bg-white"><p className="text-sm font-bold">Dayflow could not load your workspace.</p><Button onClick={() => dashboard.refetch()} className="dayflow-button mt-4 rounded-full">Try again</Button></div></DashboardLayout>;
  }

  const todayAttendance = data.attendance.find(entry => entry.workDate === dayToUtc(getTodayInput()));
  const isWorking = Boolean(todayAttendance?.checkInAt && !todayAttendance?.checkOutAt);

  return (
    <DashboardLayout>
      <div className="dayflow-live-workspace mx-auto max-w-6xl pb-12 pt-2">
        <div className="mb-7 flex flex-col gap-5 border-b border-[#172336]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Your secure workspace</p><h1 className="mt-2 font-[DM_Serif_Display] text-4xl tracking-[-0.045em] text-[#172336]">Welcome back, {data.employee.fullName.split(" ")[0]}.</h1><p className="mt-2 text-sm text-[#65717d]">Your attendance, leave, profile, and payroll records are connected to your account.</p></div>
          <div className="flex items-center gap-2 rounded-full border border-[#172336]/10 bg-[#f1f0ea] px-3 py-2 text-xs font-bold text-[#51606d]"><ShieldCheck className="h-4 w-4 text-[#385442]" />{user?.role === "admin" ? "Admin / HR access" : "Employee access"}</div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <WorkdayRail state={isWorking ? "working" : todayAttendance?.checkOutAt ? "complete" : "ready"} />
          <div className="space-y-5">
            <article className="paper-card motion-card motion-card--attendance relative overflow-hidden bg-[#172336] text-white"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div className="relative z-10"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c8d2da]">Today’s attendance</p><h2 className="mt-3 font-[DM_Serif_Display] text-4xl tracking-[-0.04em]">{isWorking ? "You’re in." : todayAttendance?.checkOutAt ? "Workday complete." : "Ready when you are."}</h2><p className="mt-2 max-w-md text-sm text-[#c8d2da]">{todayAttendance?.checkInAt ? `Checked in at ${new Date(todayAttendance.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Your start time will be recorded securely."}</p></div><div className="relative z-10 flex items-start gap-4"><WorkdayOrbit state={isWorking ? "working" : todayAttendance?.checkOutAt ? "complete" : "ready"} label={isWorking ? "In flow" : todayAttendance?.checkOutAt ? "Complete" : "Ready"} detail={isWorking ? "Live record" : "Today"} /><Clock3 className="mt-1 h-6 w-6 text-[#f9b62d]" /></div></div><div className="relative z-10 mt-7 flex flex-wrap items-center gap-3">{isWorking ? <Button disabled={checkOut.isPending} onClick={() => checkOut.mutate()} className="h-10 rounded-full bg-[#f9b62d] px-5 text-xs font-extrabold text-[#172336] hover:bg-[#ffd274]">{checkOut.isPending ? "Saving…" : "Check out"}</Button> : <Button disabled={checkIn.isPending || Boolean(todayAttendance?.checkOutAt)} onClick={() => checkIn.mutate()} className="h-10 rounded-full bg-[#f9b62d] px-5 text-xs font-extrabold text-[#172336] hover:bg-[#ffd274]">{todayAttendance?.checkOutAt ? "Completed for today" : checkIn.isPending ? "Saving…" : "Check in"}</Button>}<span className="text-xs text-[#b9c4ce]">Attendance is scoped to your profile only.</span></div></article>

            <article className="paper-card bg-white"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Leave & time off</p><h2 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">A direct route to time away.</h2></div><Button variant="outline" onClick={() => setShowLeaveForm(open => !open)} className="rounded-full border-[#172336]/15 text-xs font-extrabold">{showLeaveForm ? "Close request" : "Request leave"}</Button></div>{showLeaveForm && <form onSubmit={submitLeave} className="mt-6 grid gap-3 border-t border-[#172336]/10 pt-5 sm:grid-cols-2"><label className="text-xs font-bold">Leave type<select value={leaveType} onChange={event => setLeaveType(event.target.value as (typeof leaveTypes)[number])} className="mt-1.5 w-full rounded-lg border border-[#172336]/15 bg-[#fbfaf6] px-3 py-2 text-sm">{leaveTypes.map(type => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}</select></label><label className="text-xs font-bold">Start date<input required type="date" value={leaveStart} onChange={event => setLeaveStart(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#172336]/15 bg-[#fbfaf6] px-3 py-2 text-sm" /></label><label className="text-xs font-bold">End date<input required type="date" value={leaveEnd} onChange={event => setLeaveEnd(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#172336]/15 bg-[#fbfaf6] px-3 py-2 text-sm" /></label><label className="text-xs font-bold sm:col-span-2">Remarks<textarea value={leaveNote} onChange={event => setLeaveNote(event.target.value)} maxLength={1000} className="mt-1.5 min-h-20 w-full rounded-lg border border-[#172336]/15 bg-[#fbfaf6] px-3 py-2 text-sm" placeholder="Add context for your HR team" /></label><div className="sm:col-span-2"><Button disabled={requestLeave.isPending} className="dayflow-button rounded-full px-5 text-xs">{requestLeave.isPending ? "Sending…" : "Send request"}</Button></div></form>}<div className="mt-5 space-y-3 border-t border-[#172336]/10 pt-5">{data.leaveRequests.length ? data.leaveRequests.map(request => <div key={request.id} className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold capitalize">{request.leaveType} leave</p><p className="mt-1 text-xs text-[#65717d]">{formatDate(request.startAt)} – {formatDate(request.endAt)}</p></div><span className={`status-pill status-pill--${request.status === "approved" ? "sage" : request.status === "rejected" ? "coral" : "saffron"}`}>{request.status}</span></div>) : <p className="text-sm text-[#65717d]">No leave requests are on your record yet.</p>}</div></article>

            <article className="paper-card bg-[#e9e8e1]"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Profile</p><h2 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">Your employee record.</h2></div><button onClick={() => { setPhone(data.employee.phone ?? ""); setAddress(data.employee.address ?? ""); setShowProfileForm(open => !open); }} className="inline-flex items-center gap-1.5 text-xs font-extrabold underline decoration-[#f9b62d] decoration-2 underline-offset-4"><PencilLine className="h-3.5 w-3.5" />Edit contact details</button></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><DataPoint label="Employee code" value={data.employee.employeeCode} /><DataPoint label="Department" value={data.employee.department || "Not set"} /><DataPoint label="Role" value={data.employee.jobTitle || "Team member"} /></div>{showProfileForm && <form onSubmit={submitProfile} className="mt-6 grid gap-3 border-t border-[#172336]/10 pt-5 sm:grid-cols-2"><label className="text-xs font-bold">Phone<input value={phone} onChange={event => setPhone(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#172336]/15 bg-white px-3 py-2 text-sm" /></label><label className="text-xs font-bold">Address<input value={address} onChange={event => setAddress(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#172336]/15 bg-white px-3 py-2 text-sm" /></label><div className="sm:col-span-2"><Button disabled={saveProfile.isPending} className="dayflow-button rounded-full px-5 text-xs">{saveProfile.isPending ? "Saving…" : "Save details"}</Button></div></form>}</article>
          </div>

          <aside className="space-y-5"><article className="paper-card bg-white"><p className="eyebrow">Payroll visibility</p><div className="mt-3 flex items-start justify-between"><div><h2 className="font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">Your latest record</h2><p className="mt-2 text-sm leading-6 text-[#65717d]">Payroll information is private and read-only for employees.</p></div><FileText className="h-5 w-5 text-[#c98708]" /></div>{data.latestPayroll ? <div className="mt-5 rounded-xl bg-[#f1f0ea] p-4"><p className="text-xs font-bold">{formatDate(data.latestPayroll.periodStartAt)}</p><p className="mt-1 font-[DM_Serif_Display] text-3xl">{new Intl.NumberFormat(undefined, { style: "currency", currency: data.latestPayroll.currency }).format(data.latestPayroll.netPayCents / 100)}</p><p className="mt-1 text-xs text-[#65717d] capitalize">{data.latestPayroll.paymentStatus}</p></div> : <div className="mt-5 rounded-xl border border-dashed border-[#172336]/15 p-4 text-sm text-[#65717d]">No payroll record is available for your profile yet.</div>}</article><article className="paper-card bg-white"><p className="eyebrow">Recent attendance</p><div className="mt-5 space-y-3">{data.attendance.length ? data.attendance.slice(0, 5).map(entry => <div key={entry.id} className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">{formatDate(entry.workDate)}</p><p className="mt-1 text-xs text-[#65717d]">{entry.checkInAt ? `In ${new Date(entry.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "No check-in"}{entry.checkOutAt ? ` · Out ${new Date(entry.checkOutAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</p></div><span className="status-pill status-pill--sage capitalize">{entry.status}</span></div>) : <p className="text-sm text-[#65717d]">Your attendance history will appear here after check-in.</p>}</div></article></aside>
        </section>

        {user?.role === "admin" && <section className="mt-8 border-t border-[#172336]/10 pt-8"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow">Admin / HR workbench</p><h2 className="mt-2 font-[DM_Serif_Display] text-4xl tracking-[-0.045em]">The team decisions waiting for you.</h2></div></div>{adminOverview.isLoading ? <Loader2 className="h-6 w-6 animate-spin text-[#c98708]" /> : adminOverview.data && <div className="grid gap-5 lg:grid-cols-[0.65fr_1.35fr]"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><Metric label="Active profiles" value={String(adminOverview.data.teamCount)} /><Metric label="Present today" value={String(adminOverview.data.presentToday)} /><Metric label="Pending requests" value={String(adminOverview.data.pendingLeaveRequests.length)} /></div><article className="paper-card bg-white"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Leave approval queue</p><h3 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">Make a clear decision.</h3></div><UserRound className="h-5 w-5 text-[#c98708]" /></div><div className="mt-5 space-y-4">{adminOverview.data.pendingLeaveRequests.length ? adminOverview.data.pendingLeaveRequests.map(request => <div key={request.id} className="flex flex-col gap-3 border-t border-[#172336]/10 pt-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="text-sm font-bold">{request.employeeName}</p><p className="mt-1 text-xs text-[#65717d]"><span className="capitalize">{request.leaveType}</span> · {formatDate(request.startAt)} – {formatDate(request.endAt)}{request.note ? ` · ${request.note}` : ""}</p></div><div className="flex gap-2"><button disabled={reviewLeave.isPending} onClick={() => reviewLeave.mutate({ leaveRequestId: request.id, status: "approved" })} className="inline-flex items-center gap-1 rounded-full bg-[#172336] px-3 py-2 text-xs font-extrabold text-white"><Check className="h-3.5 w-3.5" />Approve</button><button disabled={reviewLeave.isPending} onClick={() => reviewLeave.mutate({ leaveRequestId: request.id, status: "rejected" })} className="rounded-full border border-[#172336]/15 px-3 py-2 text-xs font-extrabold">Decline</button></div></div>) : <p className="text-sm text-[#65717d]">No leave requests are waiting for review.</p>}</div></article></div>}</section>}
      </div>
    </DashboardLayout>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7b8792]">{label}</p><p className="mt-1.5 text-sm font-bold text-[#172336]">{value}</p></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="rounded-xl border border-[#172336]/10 bg-[#f1f0ea] p-4"><p className="font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">{value}</p><p className="mt-1 text-xs font-bold text-[#65717d]">{label}</p></article>;
}
