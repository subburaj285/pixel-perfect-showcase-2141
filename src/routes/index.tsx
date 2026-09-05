import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  OctagonAlert,
  Cable,
  Clock,
  TrendingDown,
  IndianRupee,
  Leaf,
  Radio,
  Cpu,
  Database,
  Signal,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ConveyorPicker } from "@/components/ConveyorPicker";
import { JointTrack } from "@/components/JointTrack";
import { PredictionPanel } from "@/components/PredictionPanel";
import { SensorCard } from "@/components/SensorCard";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import { useSystem } from "@/lib/system-store";
import { getPrediction, statusMeta, systemStatus, type Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Conveyor Health Control Room | NMDC Predictive Maintenance" },
      {
        name: "description",
        content:
          "Live conveyor belt health, joint failure risk and AI predictive maintenance for iron ore mining operations.",
      },
      { property: "og:title", content: "Conveyor Health Control Room | NMDC Predictive Maintenance" },
      {
        property: "og:description",
        content: "Detect, locate and act on belt joint failures before they stop production.",
      },
    ],
  }),
  component: Dashboard,
});

const KPI_TONE: Record<string, string> = {
  total: "bg-info-soft text-info",
  healthy: "bg-healthy-soft text-healthy",
  warning: "bg-warning-soft text-warning",
  high: "bg-risk-soft text-risk",
  critical: "bg-critical-soft text-critical",
};

function Dashboard() {
  const { conveyors, selectedConveyorId, selectedJointId, selectConveyor, selectJoint, live, alerts, tasks, setStatusFilter } =
    useSystem();
  const navigate = useNavigate();

  const conveyor = conveyors.find((c) => c.id === selectedConveyorId)!;
  const joint = conveyor.joints.find((j) => j.id === selectedJointId) ?? conveyor.joints[0];
  const prediction = getPrediction(conveyor.id);
  const sensors = live[conveyor.id] ?? conveyor.sensors;
  const counts = (s: Status) => conveyors.filter((c) => c.status === s).length;
  const total = conveyors.length;

  const kpis = [
    { key: "total" as const, label: "Total Conveyor", value: total, icon: Cable, filter: "all" as const },
    { key: "healthy" as const, label: "Healthy", value: counts("healthy"), icon: ShieldCheck, filter: "healthy" as const },
    { key: "warning" as const, label: "Warning", value: counts("warning"), icon: AlertTriangle, filter: "warning" as const },
    { key: "high" as const, label: "High Risk", value: counts("high"), icon: Flame, filter: "high" as const },
    { key: "critical" as const, label: "Critical", value: counts("critical"), icon: OctagonAlert, filter: "critical" as const },
  ];

  const donut = (["healthy", "warning", "high", "critical"] as Status[]).map((s) => ({
    name: statusMeta[s].label,
    value: counts(s),
    status: s,
    color: `var(--${statusMeta[s].token})`,
  }));

  const topAlerts = alerts.filter((a) => !a.acknowledged).slice(0, 5);
  const taskCount = (s: string) => tasks.filter((t) => t.status === s).length;

  function openKpi(filter: Status | "all") {
    setStatusFilter(filter);
    navigate({ to: "/conveyors" });
  }

  return (
    <AppShell
      title="Conveyor Belt Monitoring System"
      subtitle="Real-time monitoring · AI joint failure prediction · Predictive maintenance"
      actions={<div className="text-sm font-medium px-4 py-1.5 rounded-full bg-secondary/80 text-foreground border border-border">Iron Ore Mine — Plant 1</div>}
    >
      <div className="space-y-6">
        
        {/* TOP LEVEL KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map(({ key, label, value, icon: Icon, filter }) => (
            <button
              key={key}
              type="button"
              onClick={() => openKpi(filter)}
              className="relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 group"
            >
              <div className="flex items-center gap-4">
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-full bg-background shadow-sm border border-border transition-colors group-hover:scale-110", KPI_TONE[key].replace("bg-", "text-").replace("-soft", ""))}>
                  <Icon className="size-6" />
                </span>
                <div>
                  <div className="text-3xl font-bold font-mono tracking-tight">{value}</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
              </div>
              {key !== "total" && (
                <div className="absolute top-3 right-3 text-xs font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                  {Math.round((value / total) * 100)}%
                </div>
              )}
            </button>
          ))}
        </div>

        {/* MACRO OVERVIEW ROW */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          
          {/* CONVEYOR HEALTH DONUT */}
          <section className="rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-sm p-6 lg:col-span-1 flex flex-col">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Fleet Health Overview</h2>
            <div className="flex-1 flex flex-col justify-center items-center gap-6">
              <div className="relative size-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donut}
                      dataKey="value"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="none"
                      onClick={(d) => openKpi((d as unknown as { status: Status }).status)}
                    >
                      {donut.map((d) => (
                        <Cell key={d.name} fill={d.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-mono font-bold">{total}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Total</div>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-3">
                {donut.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => openKpi(d.status)}
                    className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2 text-sm transition-colors hover:bg-secondary border border-transparent hover:border-border"
                  >
                    <span className="size-3 rounded-full shadow-sm" style={{ background: d.color }} />
                    <span className="flex-1 text-left font-medium">{d.name}</span>
                    <span className="font-mono font-bold">{d.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ACTIVE ALERTS */}
          <section className="rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-sm p-0 flex flex-col lg:col-span-2 overflow-hidden">
            <header className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Alerts (Top 5)</h2>
              <Link to="/alerts" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View all <AlertTriangle className="size-3" />
              </Link>
            </header>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/20">
                  <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Detected Issue</th>
                    <th className="px-6 py-3 text-right font-medium">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {topAlerts.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => selectConveyor(a.conveyorId, a.jointId)}
                      className="cursor-pointer transition-colors hover:bg-accent/50 group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{a.time}</td>
                      <td className="px-4 py-4 font-mono text-xs font-medium group-hover:text-primary transition-colors">
                        {a.conveyorId} <span className="text-muted-foreground">/</span> {a.jointId}
                      </td>
                      <td className="px-4 py-4 font-medium">{a.issue}</td>
                      <td className="px-6 py-4 text-right">
                        <StatusPill status={a.severity} />
                      </td>
                    </tr>
                  ))}
                  {topAlerts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ShieldCheck className="size-8 text-healthy opacity-50" />
                          <span>No unacknowledged alerts. All conveyors nominal.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* DETAILED INSPECTION (MICRO) */}
        <div className="rounded-xl border border-border bg-gradient-to-b from-card/80 to-background shadow-lg overflow-hidden">
          {/* Header & Selector */}
          <div className="border-b border-border bg-secondary/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Conveyor Deep-Dive</h2>
              <p className="text-xs text-muted-foreground">Select a conveyor to view live telemetry and joint health.</p>
            </div>
            <div className="flex items-center gap-4 bg-background rounded-lg p-1.5 border border-border shadow-sm">
              <ConveyorPicker className="min-w-[200px]" />
              <div className="pr-3">
                <StatusPill status={conveyor.status} />
              </div>
            </div>
          </div>

          <div className="p-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            {/* Left Column: Live Data & Joints */}
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/50 p-4 border border-border/50">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Length</div>
                  <div className="font-mono text-xl font-bold text-primary">{conveyor.lengthKm} <span className="text-sm font-medium text-foreground">km</span></div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border/50">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Load</div>
                  <div className="font-mono text-xl font-bold">{conveyor.load}<span className="text-sm font-medium text-muted-foreground">%</span></div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border/50">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Speed</div>
                  <div className="font-mono text-xl font-bold">{conveyor.speed} <span className="text-sm font-medium text-muted-foreground">m/s</span></div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border/50 flex flex-col justify-center">
                  <Button asChild variant="default" size="sm" className="w-full">
                    <Link to="/live-monitor">Live Telemetry →</Link>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <ActivityIcon className="size-4" /> Live Sensor Feed
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
                  {sensors.map((s) => (
                    <SensorCard key={s.key} reading={s} />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MapIcon className="size-4" /> Joint Health Map
                  </h3>
                  <Link to="/belt-joints" className="text-xs font-semibold text-primary hover:underline">
                    Detailed Joint Analysis →
                  </Link>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                  <JointTrack joints={conveyor.joints} selectedId={joint.id} onSelect={selectJoint} />
                  
                  <div className="mt-6 grid gap-4 sm:grid-cols-4 relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-full"></div>
                    <div className="pl-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Selected Joint</div>
                      <div className="font-mono text-lg font-bold">{joint.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Position</div>
                      <div className="font-mono text-lg font-semibold">{joint.positionM.toLocaleString()} m</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Health Score</div>
                      <div className="font-mono text-lg font-semibold text-primary">{joint.health}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Condition</div>
                      <div className="font-medium inline-flex items-center gap-1.5">
                        <span className={cn("size-2 rounded-full", joint.health > 80 ? "bg-healthy" : joint.health > 50 ? "bg-warning" : "bg-critical")}></span>
                        {joint.condition}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: AI Prediction */}
            <div className="flex flex-col gap-6">
              <PredictionPanel conveyor={conveyor} joint={joint} prediction={prediction} />
              
              {/* Additional Context Panel */}
              <div className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 space-y-4 shadow-inner">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="size-4" /> Operations Impact
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex flex-col gap-1 border-b border-border/50 pb-2">
                    <span className="text-xs text-muted-foreground">Est. Downtime (If Failed)</span>
                    <span className="font-semibold text-critical">18 – 24 hours</span>
                  </li>
                  <li className="flex flex-col gap-1 border-b border-border/50 pb-2">
                    <span className="text-xs text-muted-foreground">Production Loss Risk</span>
                    <span className="font-semibold text-risk">2,500 – 4,000 tonnes</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Maintenance Queue</span>
                    <span className="font-semibold">{taskCount("critical")} critical tasks pending</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </AppShell>
  );
}

// Missing icons for the redesign
function ActivityIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
}

function MapIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
}
