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
    { key: "total" as const, label: "Total Conveyors", value: total, icon: Cable, filter: "all" as const },
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
      actions={<div className="text-xs text-muted-foreground">Iron Ore Mine — Plant 1</div>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {kpis.map(({ key, label, value, icon: Icon, filter }) => (
            <button
              key={key}
              type="button"
              onClick={() => openKpi(filter)}
              className="panel flex items-center gap-3 p-3 text-left transition-colors hover:border-primary/50"
            >
              <span className={cn("grid size-10 shrink-0 place-items-center rounded", KPI_TONE[key])}>
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block font-mono text-2xl leading-none font-bold">{value}</span>
                <span className="block text-xs text-muted-foreground">{label}</span>
                {key !== "total" && (
                  <span className="block text-[11px] text-muted-foreground">{Math.round((value / total) * 100)}%</span>
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <section className="panel p-4">
                <h2 className="panel-title mb-2">Conveyor Health</h2>
                <div className="flex items-center gap-3">
                  <div className="relative size-36 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donut}
                          dataKey="value"
                          innerRadius={48}
                          outerRadius={66}
                          paddingAngle={2}
                          stroke="none"
                          onClick={(d) => openKpi((d as unknown as { status: Status }).status)}
                        >
                          {donut.map((d) => (
                            <Cell key={d.name} fill={d.color} className="cursor-pointer" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                      <div>
                        <div className="font-mono text-2xl font-bold">{total}</div>
                        <div className="text-[11px] text-muted-foreground">Conveyors</div>
                      </div>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-1.5">
                    {donut.map((d) => (
                      <li key={d.name}>
                        <button
                          type="button"
                          onClick={() => openKpi(d.status)}
                          className="flex w-full items-center gap-2 rounded px-1 py-1 text-sm hover:bg-accent"
                        >
                          <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                          <span className="flex-1 text-left">{d.name}</span>
                          <span className="font-mono font-semibold">{d.value}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="panel">
                <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <h2 className="panel-title">Active Alerts (Top 5)</h2>
                  <Link to="/alerts" className="text-xs font-semibold text-primary hover:underline">
                    View all →
                  </Link>
                </header>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Time</th>
                      <th className="px-2 py-2 font-medium">Conveyor / Joint</th>
                      <th className="px-2 py-2 font-medium">Issue</th>
                      <th className="px-4 py-2 text-right font-medium">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAlerts.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => selectConveyor(a.conveyorId, a.jointId)}
                        className="cursor-pointer border-t border-border hover:bg-accent"
                      >
                        <td className="px-4 py-2 font-mono text-xs">{a.time}</td>
                        <td className="px-2 py-2 font-mono text-xs">
                          {a.conveyorId} / {a.jointId}
                        </td>
                        <td className="px-2 py-2">{a.issue}</td>
                        <td className="px-4 py-2 text-right">
                          <StatusPill status={a.severity} />
                        </td>
                      </tr>
                    ))}
                    {topAlerts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No unacknowledged alerts. All conveyors nominal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </div>

            <section className="panel p-4">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="panel-title">Selected conveyor — live sensor data</h2>
                <StatusPill status={conveyor.status} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {conveyor.id} · {conveyor.route}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {sensors.map((s) => (
                  <SensorCard key={s.key} reading={s} />
                ))}
              </div>
            </section>

            <section className="panel p-4">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="panel-title">Conveyor joints ({conveyor.id})</h2>
                <Link to="/belt-joints" className="text-xs font-semibold text-primary hover:underline">
                  View all joints →
                </Link>
              </div>
              <JointTrack joints={conveyor.joints} selectedId={joint.id} onSelect={selectJoint} />
              <div className="mt-3 grid gap-3 rounded border border-border bg-secondary p-3 text-sm sm:grid-cols-4">
                <div>
                  <div className="label-caps">Joint</div>
                  <div className="font-mono font-semibold">{joint.id}</div>
                </div>
                <div>
                  <div className="label-caps">Position</div>
                  <div className="font-mono font-semibold">{joint.positionM.toLocaleString()} m</div>
                </div>
                <div>
                  <div className="label-caps">Health score</div>
                  <div className="font-mono font-semibold">{joint.health}%</div>
                </div>
                <div>
                  <div className="label-caps">Condition</div>
                  <div className="font-semibold">{joint.condition}</div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-3">
              <section className="panel p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="panel-title">Maintenance tasks</h2>
                  <Link to="/maintenance" className="text-xs font-semibold text-primary hover:underline">
                    View all →
                  </Link>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {[
                    ["Critical (due soon)", taskCount("critical"), "text-critical"],
                    ["Due today", taskCount("due-today"), "text-warning"],
                    ["Upcoming", taskCount("upcoming"), "text-info"],
                    ["Overdue", taskCount("overdue"), "text-risk"],
                    ["Completed this month", taskCount("completed"), "text-healthy"],
                  ].map(([label, value, tone]) => (
                    <li key={label as string} className="flex items-center justify-between rounded bg-secondary px-2 py-1.5">
                      <span>{label}</span>
                      <span className={cn("font-mono font-bold", tone as string)}>{value}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="panel p-4">
                <h2 className="panel-title mb-2">Potential impact if not addressed</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Clock className="mt-0.5 size-4 text-critical" />
                    <span>
                      <span className="label-caps block">Estimated downtime</span>18 – 24 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingDown className="mt-0.5 size-4 text-critical" />
                    <span>
                      <span className="label-caps block">Production loss</span>2,500 – 4,000 tonnes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IndianRupee className="mt-0.5 size-4 text-risk" />
                    <span>
                      <span className="label-caps block">Repair cost</span>2 – 3× planned maintenance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="mt-0.5 size-4 text-warning" />
                    <span>
                      <span className="label-caps block">Environmental</span>Higher CO₂ from haul-truck backup
                    </span>
                  </li>
                </ul>
              </section>

              <section className="panel p-4">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="panel-title">System status</h2>
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-healthy">
                    <span className="size-2 rounded-full bg-healthy" /> All systems operational
                  </span>
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2">
                    <Radio className="size-4 text-muted-foreground" /> Sensors
                    <span className="ml-auto font-mono">
                      {systemStatus.sensorsOnline} online / {systemStatus.sensorsOffline} offline
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Cpu className="size-4 text-muted-foreground" /> Edge devices
                    <span className="ml-auto font-mono">{systemStatus.edgeDevices} online</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="size-4 text-muted-foreground" /> Data quality
                    <span className="ml-auto font-mono">{systemStatus.dataQuality}%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Signal className="size-4 text-muted-foreground" /> Network
                    <span className="ml-auto font-mono">{systemStatus.network}</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div className="space-y-4">
            <section className="panel p-4">
              <div className="mb-3 flex items-center gap-2">
                <ConveyorPicker className="flex-1" />
                <StatusPill status={conveyor.status} />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="label-caps">Belt length</dt>
                  <dd className="font-mono font-semibold">{conveyor.lengthKm} km</dd>
                </div>
                <div>
                  <dt className="label-caps">Current load</dt>
                  <dd className="font-mono font-semibold">{conveyor.load}%</dd>
                </div>
                <div>
                  <dt className="label-caps">Running speed</dt>
                  <dd className="font-mono font-semibold">{conveyor.speed} m/s</dd>
                </div>
                <div>
                  <dt className="label-caps">Selected joint</dt>
                  <dd className="font-mono font-semibold">{joint.id}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="label-caps">Belt position</dt>
                  <dd className="font-mono font-semibold">
                    {joint.positionM.toLocaleString()} m
                    <span className="ml-1 text-xs font-normal text-muted-foreground">from drive pulley</span>
                  </dd>
                </div>
              </dl>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/live-monitor">Open live monitor</Link>
              </Button>
            </section>

            <PredictionPanel conveyor={conveyor} joint={joint} prediction={prediction} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
