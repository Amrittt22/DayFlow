type WorkdayOrbitProps = {
  state: "ready" | "working" | "complete";
  label: string;
  detail: string;
};

export function HeroOrbit() {
  return (
    <div className="hero-orbit" aria-hidden="true">
      <div className="hero-orbit__scene">
        <div className="hero-orbit__ring hero-orbit__ring--one" />
        <div className="hero-orbit__ring hero-orbit__ring--two" />
        <div className="hero-orbit__center">
          <span className="hero-orbit__sun" />
          <span className="hero-orbit__pulse" />
        </div>
        <div className="hero-orbit__card hero-orbit__card--attendance">
          <span>Attendance</span>
          <strong>Aligned</strong>
          <i />
        </div>
        <div className="hero-orbit__card hero-orbit__card--leave">
          <span>Leave</span>
          <strong>In view</strong>
          <i />
        </div>
        <div className="hero-orbit__card hero-orbit__card--payroll">
          <span>Payroll</span>
          <strong>Private</strong>
          <i />
        </div>
      </div>
    </div>
  );
}

export function WorkdayOrbit({ state, label, detail }: WorkdayOrbitProps) {
  return (
    <div className={`workday-orbit workday-orbit--${state}`} aria-label={`${label}: ${detail}`}>
      <div className="workday-orbit__halo" />
      <div className="workday-orbit__ring"><span className="workday-orbit__satellite" /></div>
      <div className="workday-orbit__core"><span>Dayflow</span><strong>{label}</strong></div>
      <div className="workday-orbit__caption">{detail}</div>
    </div>
  );
}

export function WorkdayRail({ state }: { state: WorkdayOrbitProps["state"] }) {
  const current = state === "complete" ? 4 : state === "working" ? 2 : 1;
  const caption = state === "complete" ? "Today is recorded" : state === "working" ? "Your workday is in motion" : "Your workday is ready to begin";

  return (
    <div className="workday-rail" data-state={state} aria-label={`Workday progression: ${caption}`}>
      <div className="workday-rail__heading"><span>Today’s route</span><strong>{caption}</strong></div>
      <div className="workday-rail__track">
        {["Arrive", "Focus", "Review", "Close"].map((step, index) => (
          <div key={step} className={`workday-rail__step ${index + 1 <= current ? "workday-rail__step--active" : ""}`}>
            <i />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolOrbit({ kind, status }: { kind: "bulletin" | "payroll"; status: "new" | "read" | "quiet" | "draft" | "ready" }) {
  const icon = kind === "bulletin" ? "✦" : "$";
  const label = status === "new" ? "New" : status === "draft" ? "Draft" : status === "ready" ? "Ready" : status === "read" ? "Read" : "Quiet";
  return <div className={`tool-orbit tool-orbit--${kind} tool-orbit--${status}`} aria-label={`${kind} tool status: ${label}`}><div className="tool-orbit__ring"><i /></div><div className="tool-orbit__core"><span>{icon}</span></div><b>{label}</b></div>;
}

export function RequestOrbit({ state, count }: { state: "active" | "clear"; count: number }) {
  return <div className={`request-orbit request-orbit--${state}`} aria-label={`${count} active HR requests`}><div className="request-orbit__ring"><i /></div><div className="request-orbit__core"><span>{count}</span><small>{count === 1 ? "item" : "items"}</small></div><b>{state === "active" ? "In motion" : "Clear"}</b></div>;
}
