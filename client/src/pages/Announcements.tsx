import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { ToolOrbit } from "@/components/DayflowMotion";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BellRing, Loader2, Pin, Plus, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

function formatPublished(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function Announcements() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const announcements = trpc.hr.myAnnouncements.useQuery(undefined, { enabled: isAuthenticated });
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "employees" | "admins">("all");
  const [isPinned, setIsPinned] = useState(false);

  const createAnnouncement = trpc.hr.createAnnouncement.useMutation({
    onSuccess: async () => {
      await utils.hr.myAnnouncements.invalidate();
      setComposerOpen(false);
      setTitle("");
      setBody("");
      setAudience("all");
      setIsPinned(false);
      toast.success("Announcement published", { description: "The selected Dayflow audience can now see it." });
    },
    onError: error => toast.error(error.message),
  });
  const markRead = trpc.hr.markAnnouncementRead.useMutation({
    onSuccess: async () => { await utils.hr.myAnnouncements.invalidate(); },
    onError: error => toast.error(error.message),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createAnnouncement.mutate({ title, body, audience, isPinned });
  };

  return <DashboardLayout><div className="dayflow-live-workspace mx-auto max-w-6xl pb-12 pt-2"><div className="mb-7 flex flex-col gap-4 border-b border-[#172336]/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Shared signal</p><h1 className="mt-2 font-[DM_Serif_Display] text-4xl tracking-[-0.045em]">Dayflow bulletin</h1><p className="mt-2 max-w-xl text-sm text-[#65717d]">Important updates are placed in one calm, role-aware stream—no loose threads or missed notes.</p></div>{user?.role === "admin" && <Button onClick={() => setComposerOpen(open => !open)} className="dayflow-button rounded-full px-5 text-xs"><Plus className="h-4 w-4" />{composerOpen ? "Close composer" : "Publish update"}</Button>}</div>
    <section className="grid gap-5 lg:grid-cols-[0.76fr_1.24fr]">{user?.role === "admin" && <aside className="tool-sidebar-card"><ToolOrbit kind="bulletin" status={announcements.data?.filter(item => !item.readAt).length ? "new" : "quiet"} /><p className="eyebrow mt-4">Audience signal</p><h2 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">Publish with intent.</h2><p className="mt-3 text-sm leading-6 text-[#65717d]">Use a focused title, clear context, and a defined audience. Dayflow records who has seen each update.</p></aside>}
      <div className={user?.role === "admin" ? "" : "lg:col-span-2"}>{composerOpen && <form onSubmit={submit} className="tool-composer motion-card mb-5"><div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Admin / HR tool</p><h2 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">Create an announcement</h2></div><BellRing className="h-5 w-5 text-[#c98708]" /></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold sm:col-span-2">Title<input required value={title} maxLength={140} onChange={event => setTitle(event.target.value)} placeholder="A concise, clear headline" className="tool-input mt-1.5" /></label><label className="text-xs font-bold sm:col-span-2">Message<textarea required value={body} maxLength={2000} onChange={event => setBody(event.target.value)} placeholder="Share the context your audience needs." className="tool-input mt-1.5 min-h-28" /></label><label className="text-xs font-bold">Audience<select value={audience} onChange={event => setAudience(event.target.value as typeof audience)} className="tool-input mt-1.5"><option value="all">Everyone</option><option value="employees">Employees</option><option value="admins">Admin / HR</option></select></label><label className="flex items-end gap-2 pb-2 text-xs font-bold"><input checked={isPinned} onChange={event => setIsPinned(event.target.checked)} type="checkbox" className="h-4 w-4 accent-[#f9b62d]" />Pin above the stream</label></div><div className="mt-5 flex justify-end"><Button disabled={createAnnouncement.isPending} className="dayflow-button rounded-full px-5 text-xs"><Send className="h-3.5 w-3.5" />{createAnnouncement.isPending ? "Publishing…" : "Publish update"}</Button></div></form>}
        {announcements.isLoading ? <div className="grid min-h-64 place-items-center"><Loader2 className="h-7 w-7 animate-spin text-[#c98708]" /></div> : announcements.isError ? <article className="tool-error-state"><BellRing className="h-7 w-7 text-[#c98708]" /><div><p className="eyebrow">Stream unavailable</p><h2 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">The bulletin could not load.</h2><p className="mt-2 text-sm text-[#65717d]">Please try again. Your account and role permissions remain protected.</p><Button onClick={() => announcements.refetch()} className="dayflow-button mt-4 rounded-full px-5 text-xs">Retry bulletin</Button></div></article> : <div className="space-y-4">{announcements.data?.length ? announcements.data.map(item => <article key={item.id} className={`announcement-card ${item.readAt ? "announcement-card--read" : "announcement-card--new"}`}><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="status-pill status-pill--navy capitalize">{item.audience === "all" ? "Everyone" : item.audience}</span>{item.isPinned && <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#8e5e00]"><Pin className="h-3.5 w-3.5" />Pinned</span>}</div><h2 className="mt-3 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">{item.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d6875]">{item.body}</p><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#7b8792]">{item.authorName || "Dayflow Admin"} · {formatPublished(item.publishedAt)}</p></div><ToolOrbit kind="bulletin" status={item.readAt ? "read" : "new"} /></div>{!item.readAt && <button disabled={markRead.isPending} onClick={() => markRead.mutate({ announcementId: item.id })} className="tool-link mt-5">Mark as read <span>→</span></button>}</article>) : <article className="tool-empty-state"><ToolOrbit kind="bulletin" status="quiet" /><div><p className="eyebrow">Quiet for now</p><h2 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">No announcements yet.</h2><p className="mt-2 text-sm text-[#65717d]">{user?.role === "admin" ? "Use the publish tool to add the first shared update." : "Updates from Admin / HR will arrive here when they are published."}</p></div></article>}</div>}</div></section></div></DashboardLayout>;
}
