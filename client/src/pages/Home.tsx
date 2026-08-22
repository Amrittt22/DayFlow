/**
 * Dayflow — Paper Motion design system
 * Editorial people-operations workspace: ink navy structure, saffron annotation marks,
 * tactile paper planes, and clear human-centered workflows.
 */
import { Button } from "@/components/ui/button";
import { HeroOrbit } from "@/components/DayflowMotion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { startLogin } from "@/const";

const assets = {
  hero: "/manus-storage/dayflow-hero-workspace_dd01f3ea.png",
  attendance: "/manus-storage/dayflow-attendance-visual_77dce548.png",
  leave: "/manus-storage/dayflow-leave-visual_45420575.png",
  texture: "/manus-storage/dayflow-background-texture_cc455d64.png",
  logo: "/manus-storage/dayflow-logo-mark_b370aa1d.png",
};

type WorkspaceMode = "employee" | "admin";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "People", icon: UsersRound },
  { label: "Attendance", icon: Clock3 },
  { label: "Leave & time off", icon: CalendarDays },
  { label: "Payroll", icon: CircleDollarSign },
];

const people = [
  { initials: "AN", name: "Ariana N.", role: "Product Design", state: "Working" },
  { initials: "MO", name: "Mika O.", role: "Engineering", state: "Remote" },
  { initials: "SR", name: "Samir R.", role: "Customer Success", state: "On leave" },
];

function SaffronMark({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`saffron-mark ${className}`} />;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        className={`${compact ? "h-10 w-10" : "h-12 w-12"} object-contain`}
        src={assets.logo}
        alt=""
        aria-hidden="true"
      />
      {!compact && (
        <span className="font-[Manrope] text-[1.15rem] font-extrabold tracking-[-0.06em] text-[#172336]">
          dayflow
        </span>
      )}
    </div>
  );
}

function StatusPill({
  label,
  tone = "sage",
}: {
  label: string;
  tone?: "sage" | "saffron" | "coral" | "navy";
}) {
  return <span className={`status-pill status-pill--${tone}`}>{label}</span>;
}

function Avatar({ initials, tone = "cream" }: { initials: string; tone?: "cream" | "sage" | "saffron" | "navy" }) {
  return <span className={`avatar avatar--${tone}`}>{initials}</span>;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (sectionId: string) => {
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openWorkspace = () => setLocation("/app");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfaf6] text-[#172336]">
      <header className="sticky top-0 z-50 border-b border-[#172336]/[0.08] bg-[#fbfaf6]/90 backdrop-blur-xl">
        <div className="page-shell flex h-[72px] items-center justify-between">
          <button aria-label="Back to top" onClick={() => goTo("top")} className="rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#f9b62d]">
            <Logo />
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            <button onClick={() => goTo("workspace")} className="nav-link">Product tour</button>
            <button onClick={() => goTo("workflows")} className="nav-link">Workflows</button>
            <button onClick={() => goTo("modules")} className="nav-link">Modules</button>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={startLogin} className="nav-link px-3 py-2">Sign in</button>
            <Button onClick={() => setLocation("/app")} className="dayflow-button h-10 rounded-full px-5 text-sm">
              Open workspace <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#172336]/10 bg-white md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[#172336]/[0.08] bg-[#fbfaf6] px-5 py-5 md:hidden">
            <div className="mx-auto flex max-w-md flex-col gap-1">
              {["workspace", "workflows", "modules"].map((section) => (
                <button key={section} onClick={() => goTo(section)} className="flex items-center justify-between border-b border-[#172336]/[0.08] py-3 text-left text-sm font-bold capitalize">
                  {section === "workspace" ? "Product tour" : section}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section id="top" className="hero35-section relative isolate overflow-hidden">
        <img src={assets.texture} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-50" />
        <div aria-hidden="true" className="hero35-aurora hero35-aurora--one" />
        <div aria-hidden="true" className="hero35-aurora hero35-aurora--two" />
        <div className="page-shell relative z-10 flex min-h-[700px] flex-col items-center pb-14 pt-16 text-center lg:pb-20 lg:pt-20">
          <div className="hero35-kicker"><span className="hero35-kicker__dot" />Human resource management system</div>
          <h1 className="hero35-title mt-7 max-w-5xl font-[DM_Serif_Display] text-[clamp(3.5rem,7vw,6.85rem)] leading-[0.9] tracking-[-0.06em] text-[#172336]">People operations,<br /><span className="relative italic text-[#385442]">thought through together.<SaffronMark className="absolute -bottom-1 left-[8%] h-3 w-[82%] -rotate-1" /></span></h1>
          <p className="mt-12 max-w-2xl text-[1.02rem] leading-7 text-[#586574]">Bring attendance, leave, employee records, announcements, and payroll into one calm place—then take the next clear action.</p>
          <div className="hero35-stage mt-10 w-full max-w-5xl text-left">
            <div className="hero35-command"><div className="hero35-command__top"><div className="flex items-center gap-2"><span className="hero35-model-mark"><Sparkles className="h-3.5 w-3.5" /></span><span className="text-xs font-extrabold text-[#172336]">Dayflow flow</span><span className="rounded-full bg-[#f1f0ea] px-2 py-1 text-[10px] font-bold text-[#687483]">Secure workspace</span></div><span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#7b8792]">Today</span></div><button onClick={openWorkspace} className="hero35-command__prompt"><span>What needs your attention today?</span><span className="hero35-command__send"><ArrowRight className="h-4 w-4" /></span></button><div className="hero35-shortcuts"><button onClick={openWorkspace}><CalendarDays className="h-4 w-4" />Attendance</button><button onClick={() => setLocation("/announcements")}><Bell className="h-4 w-4" />Bulletin</button><button onClick={() => setLocation("/payroll")}><CircleDollarSign className="h-4 w-4" />Payroll</button></div></div>
            <div className="hero35-preview"><div className="hero35-preview__paper"><div className="hero35-preview__meta"><span>Workday overview</span><span className="status-pill status-pill--sage">Aligned</span></div><p className="font-[DM_Serif_Display] text-3xl tracking-[-0.04em] text-[#172336]">A clear next step, for every person.</p><div className="hero35-preview__rail"><span className="hero35-preview__rail-dot hero35-preview__rail-dot--active" /><span /><span /><span /></div><div className="hero35-preview__checks"><span><i />Attendance in view</span><span><i />Leave requests clear</span><span><i />Payroll private</span></div></div><HeroOrbit /><img src={assets.hero} alt="Layered Dayflow attendance and leave management workspace illustration" className="hero35-preview__image" /></div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"><div><p className="metric-number">04</p><p className="metric-label">Core employee tools</p></div><div><p className="metric-number">02</p><p className="metric-label">Role-based workspaces</p></div><div><p className="metric-number">01</p><p className="metric-label">Clear source of truth</p></div></div>
        </div>
      </section>

      <section id="workspace" className="scroll-mt-24 bg-[#172336] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-[600px] text-white">
              <div className="mb-5 flex items-center gap-3"><span className="section-logo-mark"><img src={assets.logo} alt="" /></span><span className="eyebrow eyebrow--dark">The Dayflow workspace</span><SaffronMark className="w-10" /></div>
              <h2 className="font-[DM_Serif_Display] text-4xl leading-none tracking-[-0.04em] sm:text-5xl">Workflows that meet people where they are.</h2>
            </div>
            <p className="max-w-[400px] text-sm leading-6 text-[#c7d1db]">Switch the perspective to see the employee self-service experience and the admin approval view defined in the Dayflow requirements.</p>
          </div>

          <div className="workspace-shell workspace-shell--depth overflow-hidden border border-white/10 bg-[#f5f4ef] shadow-[0_35px_100px_rgba(0,0,0,0.3)]">
            <aside className="workspace-sidebar hidden w-[238px] shrink-0 flex-col border-r border-[#172336]/10 bg-[#e9e8e1] p-5 lg:flex">
              <Logo compact />
              <div className="mt-10 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = item.label === "Overview";
                  return (
                    <button
                      key={item.label}
                      onClick={openWorkspace}
                      className={`sidebar-link ${active ? "sidebar-link--active" : ""}`}
                    >
                      <Icon className="h-[17px] w-[17px]" />
                      <span>{item.label}</span>
                      {item.label === "Leave & time off" && <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#f9b62d] px-1 text-[10px] font-black text-[#172336]">1</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-auto rounded-[18px] border border-[#172336]/10 bg-[#fbfaf6] p-4">
                <div className="flex items-start gap-2.5"><Sparkles className="mt-0.5 h-4 w-4 text-[#c98708]" /><div><p className="text-xs font-extrabold">Your Dayflow</p><p className="mt-1 text-[11px] leading-4 text-[#687483]">A focused place for people work, every day.</p></div></div>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="flex min-h-[72px] items-center justify-between border-b border-[#172336]/10 bg-white/70 px-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <button onClick={openWorkspace} className="grid h-9 w-9 place-items-center rounded-full border border-[#172336]/10 bg-white lg:hidden"><Menu className="h-4 w-4" /></button>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8793]">Overview</p>
                    <p className="text-sm font-extrabold text-[#172336]">Tuesday, 19 March</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden items-center rounded-full border border-[#172336]/10 bg-white px-3 py-2 sm:flex"><Search className="mr-2 h-4 w-4 text-[#7c8793]" /><span className="text-xs text-[#7c8793]">Search people</span></div>
                  <button onClick={openWorkspace} className="grid h-9 w-9 place-items-center rounded-full border border-[#172336]/10 bg-white"><Bell className="h-4 w-4" /></button>
                  <Avatar initials="AJ" tone="navy" />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-[#172336]/10 bg-white/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div><p className="text-xs font-extrabold text-[#172336]">Admin / HR preview</p><p className="mt-1 text-xs text-[#687483]">Your signed-in workspace automatically shows the right access level.</p></div>
                <button onClick={openWorkspace} className="inline-flex items-center gap-1.5 text-xs font-extrabold underline decoration-[#f9b62d] decoration-2 underline-offset-4">Open live workspace <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>

              <AdminPanel openWorkspace={openWorkspace} />
            </div>
          </div>
        </div>
      </section>

      <section id="workflows" className="scroll-mt-24 bg-[#f1f0ea] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="mb-5 flex items-center gap-3"><span className="eyebrow">A calmer decision flow</span><SaffronMark className="w-11" /></div>
            <h2 className="font-[DM_Serif_Display] text-5xl leading-[0.95] tracking-[-0.045em] text-[#172336]">From request to record, without the back-and-forth.</h2>
            <p className="mt-6 max-w-[440px] text-[1.03rem] leading-7 text-[#5a6774]">Dayflow gives employees a direct route to time off, then gives HR the context required to make a confident decision. Every status change returns to the employee record right away.</p>
            <button onClick={openWorkspace} className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#172336] underline decoration-[#f9b62d] decoration-[3px] underline-offset-4 transition hover:text-[#385442]">Open the approval workspace <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="relative pl-8 sm:pl-12">
            <span aria-hidden="true" className="absolute left-[15px] top-4 h-[calc(100%-2rem)] w-px bg-[#172336]/15 sm:left-[23px]" />
            {[
              ["01", "A request is made", "Choose paid, sick, or unpaid leave, add dates and context, then send it on its way."],
              ["02", "The right person decides", "HR sees the request beside the employee’s attendance and leave context—without chasing documents."],
              ["03", "The record stays current", "Approval, rejection, and remarks flow back into the employee’s timeline and available balance."],
            ].map(([number, title, copy], index) => (
              <article key={number} className="workflow-step relative pb-9 last:pb-0">
                <span className={`workflow-node ${index === 1 ? "workflow-node--highlight" : ""}`}>{number}</span>
                <div className="paper-line"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7b8792]">Moment {number}</p><h3 className="mt-2 font-[DM_Serif_Display] text-3xl tracking-[-0.03em]">{title}</h3><p className="mt-3 max-w-[480px] text-sm leading-6 text-[#5a6774]">{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="scroll-mt-24 bg-[#fbfaf6] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-[580px]"><div className="mb-5 flex items-center gap-3"><span className="eyebrow">The core HR toolkit</span><SaffronMark className="w-10" /></div><h2 className="font-[DM_Serif_Display] text-5xl leading-[0.96] tracking-[-0.045em]">Everything that belongs in a well-run workday.</h2></div><p className="max-w-[330px] text-sm leading-6 text-[#65717d]">Each area is designed around a single, familiar job—so people do not have to learn an enterprise system to complete it.</p></div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="feature-card feature-card--paper feature-card--wide group relative overflow-hidden bg-[#e9e8e1] p-7 sm:p-9">
              <div className="paper-tab" /><div className="relative z-10 max-w-[300px]"><div className="icon-square"><Clock3 className="h-5 w-5" /></div><DateRail /><h3 className="mt-5 font-[DM_Serif_Display] text-4xl tracking-[-0.04em]">Attendance that has a pulse.</h3><p className="mt-4 text-sm leading-6 text-[#5b6874]">Check in, check out, and understand daily or weekly status at a glance. HR sees the whole rhythm without extra follow-up.</p><button onClick={openWorkspace} className="feature-link">Open employee attendance <ArrowRight className="h-4 w-4" /></button></div><img src={assets.attendance} alt="Dayflow attendance tracking objects" className="feature-art absolute -bottom-8 -right-10 w-[57%] max-w-[380px] transition duration-500 group-hover:-translate-y-2 group-hover:-rotate-1" /></article>
            <article className="feature-card feature-card--paper feature-card--dark feature-card--wide group relative overflow-hidden bg-[#172336] p-7 text-white sm:p-9">
              <div className="paper-tab paper-tab--light" /><div className="relative z-10 max-w-[300px]"><div className="icon-square icon-square--dark"><CalendarDays className="h-5 w-5" /></div><DateRail light /><h3 className="mt-5 font-[DM_Serif_Display] text-4xl tracking-[-0.04em]">Leave, seen all the way through.</h3><p className="mt-4 text-sm leading-6 text-[#c3ccd5]">Give employees a simple request path. Give decision-makers one trusted queue with the context to approve or comment.</p><button onClick={openWorkspace} className="feature-link feature-link--light">Open approval queue <ArrowRight className="h-4 w-4" /></button></div><img src={assets.leave} alt="Dayflow leave approval paper sculpture" className="feature-art absolute -bottom-12 -right-8 w-[59%] max-w-[390px] transition duration-500 group-hover:-translate-y-2 group-hover:rotate-1" /></article>
            <article className="feature-card feature-card--paper border border-[#172336]/10 bg-white p-7 sm:p-9"><div className="paper-tab" /><div className="icon-square"><UserRound className="h-5 w-5" /></div><DateRail /><h3 className="mt-5 font-[DM_Serif_Display] text-3xl tracking-[-0.035em]">Profiles with useful context.</h3><p className="mt-3 max-w-[440px] text-sm leading-6 text-[#5b6874]">Bring together personal details, role information, documents, salary structure, and the editing rights appropriate to each role.</p><div className="mt-7 flex items-center gap-2"><Avatar initials="AJ" tone="saffron" /><div><p className="text-xs font-extrabold">Role-aware profiles</p><p className="text-[11px] text-[#7b8792]">Employee editing, HR oversight.</p></div></div></article>
            <article className="feature-card feature-card--paper border border-[#172336]/10 bg-[#f1f0ea] p-7 sm:p-9"><div className="paper-tab" /><div className="icon-square bg-[#172336] text-white"><CircleDollarSign className="h-5 w-5" /></div><DateRail /><h3 className="mt-5 max-w-[430px] font-[DM_Serif_Display] text-3xl tracking-[-0.035em]">Payroll visibility, with the right boundaries.</h3><p className="mt-3 max-w-[440px] text-sm leading-6 text-[#5c6170]">Employees see their own payroll information read-only. Admin teams manage all employee records and salary structures with confidence.</p><div className="mt-7 flex items-center gap-2 text-xs font-extrabold text-[#172336]"><FileText className="h-4 w-4 text-[#c98708]" />Clear records. Responsible access.</div></article>
          </div>
        </div>
      </section>

      <section className="bg-[#385442] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-[660px] text-white"><div className="mb-5 flex items-center gap-3"><span className="section-logo-mark section-logo-mark--dark"><img src={assets.logo} alt="" /></span><span className="eyebrow eyebrow--dark">The next workday</span><SaffronMark className="w-12" /></div><h2 className="font-[DM_Serif_Display] text-5xl leading-[0.95] tracking-[-0.045em]">A foundation for alerts, attendance reports, and salary slips.</h2><p className="mt-5 text-[1rem] leading-7 text-[#dbe5d3]">The Dayflow plan adds practical next steps: email alerts that surface an action, reports that explain attendance, and salary slips employees can retrieve without asking HR.</p></div>
          <button onClick={openWorkspace} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f9b62d] px-6 text-sm font-extrabold text-[#172336] transition hover:-translate-y-0.5 hover:bg-[#ffd274] active:scale-[0.97]">Open roadmap workspace <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>

      <footer className="bg-[#fbfaf6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-7 border-t border-[#172336]/10 pt-8 sm:flex-row sm:items-end">
          <div><Logo /><p className="mt-3 max-w-sm text-xs leading-5 text-[#697583]">A user-friendly HRMS concept based on the Dayflow functional requirements document.</p></div>
          <p className="text-xs text-[#7b8792]">Every workday, perfectly aligned.</p>
        </div>
      </footer>
    </main>
  );
}

function AdminPanel({ openWorkspace }: { openWorkspace: () => void }) {
  return (
    <div className="dashboard-content grid gap-5 p-5 sm:p-7 xl:grid-cols-[1.28fr_0.72fr]">
      <div>
        <p className="eyebrow">Admin / HR dashboard</p>
        <h3 className="mt-2 font-[DM_Serif_Display] text-[2.25rem] leading-none tracking-[-0.04em]">The work that needs you.</h3>
        <p className="mt-2 text-sm text-[#65717d]">A focused queue for people decisions and the wider team picture.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3"><MiniMetric value="—" label="Active teammates" detail="Live after sign-in" tone="navy" /><MiniMetric value="—" label="Present today" detail="Live after sign-in" tone="sage" /><MiniMetric value="—" label="Awaiting review" detail="Live after sign-in" tone="saffron" /></div>
        <article className="paper-card mt-5 bg-white"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7b8792]">Decision queue</p><h4 className="mt-1 font-[DM_Serif_Display] text-2xl tracking-[-0.03em]">Leave approvals, live when signed in.</h4></div><StatusPill label="Secure" tone="sage" /></div><div className="mt-5 flex flex-col gap-4 border-t border-[#172336]/10 pt-5 sm:flex-row sm:items-center"><Avatar initials="HR" tone="saffron" /><div className="min-w-0 flex-1"><p className="text-sm font-extrabold">Role-aware approval queue</p><p className="mt-1 text-xs leading-5 text-[#65717d]">Approved Admin / HR users can make leave decisions in the authenticated workspace.</p></div><button onClick={openWorkspace} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#172336] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#385442] active:scale-[0.97]">Open queue<ArrowRight className="h-3.5 w-3.5" /></button></div></article>
        <article className="paper-card mt-5 bg-[#e9e8e1]"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7b8792]">Team pulse</p><h4 className="mt-1 font-[DM_Serif_Display] text-2xl tracking-[-0.03em]">Attendance, this week</h4></div><button onClick={openWorkspace} className="text-xs font-extrabold underline decoration-[#f9b62d] decoration-2 underline-offset-4">Open live reports</button></div><div className="mt-6 flex h-24 items-end gap-2">{[55, 76, 63, 87, 72, 44, 30].map((height, index) => <span key={index} style={{ height: `${height}%` }} className={`flex-1 rounded-t-md ${index === 3 ? "bg-[#f9b62d]" : "bg-[#385442]"}`} />)}</div><div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8792]"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></article>
      </div>
      <aside className="space-y-5">
        <article className="paper-card bg-[#172336] text-white"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c5d0da]">People directory</p><UsersRound className="h-4 w-4 text-[#f9b62d]" /></div><div className="mt-5 space-y-4">{people.map((person, index) => <div key={person.name} className="flex items-center gap-3"><Avatar initials={person.initials} tone={index === 1 ? "sage" : index === 2 ? "navy" : "cream"} /><div className="min-w-0 flex-1"><p className="text-xs font-extrabold">{person.name}</p><p className="mt-0.5 truncate text-[10px] text-[#bac6d0]">{person.role}</p></div><span className={`h-2 w-2 rounded-full ${person.state === "Working" ? "bg-[#a8cf87]" : person.state === "Remote" ? "bg-[#f9b62d]" : "bg-[#e78575]"}`} /></div>)}</div><button onClick={openWorkspace} className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-white underline decoration-[#f9b62d] decoration-2 underline-offset-4">Open all people <ArrowRight className="h-3.5 w-3.5" /></button></article>
        <article className="paper-card bg-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7b8792]">Live work areas</p><div className="mt-5 space-y-4"><ActivityItem icon={<CheckCircle2 className="h-4 w-4" />} title="Leave approval queue" sub="Admin / HR access" tone="sage" /><ActivityItem icon={<UserRound className="h-4 w-4" />} title="Employee directory" sub="Admin / HR access" tone="saffron" /><ActivityItem icon={<Clock3 className="h-4 w-4" />} title="Attendance record" sub="Employee access" tone="navy" /></div></article>
      </aside>
    </div>
  );
}

function MiniMetric({ value, label, detail, tone }: { value: string; label: string; detail: string; tone: "navy" | "sage" | "saffron" }) {
  return <article className={`mini-metric mini-metric--${tone}`}><DateRail light={tone === "navy"} /><p className="mt-3 font-[DM_Serif_Display] text-3xl tracking-[-0.04em]">{value}</p><p className="mt-1 text-xs font-extrabold">{label}</p><p className="mt-1 text-[10px] opacity-70">{detail}</p></article>;
}

function DateRail({ light = false, label = "" }: { light?: boolean; label?: string }) {
  return <div className={`date-rail ${light ? "date-rail--light" : ""}`} aria-label={label ? `Date rail ${label}` : undefined}><span /><span /><span className="date-rail__active" /><span /><span />{label && <small>{label}</small>}</div>;
}

function DayBlock({ day, date, state }: { day: string; date: string; state: "done" | "now" | "future" }) {
  return <div className={`day-block day-block--${state}`}><span className="text-[10px] font-bold uppercase tracking-[0.1em]">{day}</span><span className="mt-2 font-[DM_Serif_Display] text-2xl">{date}</span><span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-70" /></div>;
}

function ActivityItem({ icon, title, sub, tone }: { icon: React.ReactNode; title: string; sub: string; tone: "sage" | "saffron" | "navy" }) {
  return <div className="flex gap-3"><span className={`activity-icon activity-icon--${tone}`}>{icon}</span><div className="min-w-0"><p className="text-xs font-extrabold leading-5 text-[#172336]">{title}</p><p className="text-[10px] leading-4 text-[#7b8792]">{sub}</p></div></div>;
}
