import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle2,
  ShieldAlert,
  Radio,
  Filter,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Clock,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import type { Severity } from "@/lib/mock-data";

export const Route = createFileRoute("/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  const { alerts, acknowledge, selectConveyor } = useSystem();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = alerts.filter((a) => {
    const matchesFilter = filter === "all" ? true : a.severity === filter;
    const matchesSearch =
      a.conveyorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.jointId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInspect = (conveyorId: string, jointId: string) => {
    selectConveyor(conveyorId, jointId);
    navigate({ to: "/live-monitor" });
  };

  const unackCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  return (
    <AppShell
      title="SCADA Alarm & Telemetry Management"
      subtitle="Real-time IoT sensor anomaly signals, edge node alerts, and automated SCADA event response"
    >
      <div className="space-y-6">
        {/* SCADA EXECUTIVE TELEMETRY KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-primary-soft/20 border-l-4 border-l-primary flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Active Telemetry Nodes
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-foreground">12 Nodes</div>
              <div className="text-[11px] text-healthy font-semibold mt-1 flex items-center gap-1.5 font-mono">
                <span className="size-2 rounded-full bg-healthy animate-pulse" /> LATENCY &lt; 6ms
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20 shadow-xs">
              <Radio className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-critical-soft/20 border-l-4 border-l-critical flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Unacknowledged Alarms
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-critical">{unackCount} Signals</div>
              <div className="text-[11px] text-critical font-semibold mt-1">
                Priority Action Required
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-critical-soft text-critical flex items-center justify-center border border-critical/20 shadow-xs">
              <ShieldAlert className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-risk-soft/20 border-l-4 border-l-risk flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Critical & High Severity
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-risk">
                {criticalCount + highCount} Events
              </div>
              <div className="text-[11px] text-risk font-semibold mt-1">
                Edge Anomaly Band P1/P2
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-risk-soft text-risk flex items-center justify-center border border-risk/20 shadow-xs">
              <Zap className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-warning-soft/20 border-l-4 border-l-warning flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                SCADA Sensor Rate
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-warning">1,250 Hz</div>
              <div className="text-[11px] text-muted-foreground font-semibold mt-1">
                High-Frequency Sampling
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-warning-soft text-warning flex items-center justify-center border border-warning/20 shadow-xs">
              <Activity className="size-6" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="panel p-4 flex flex-wrap items-center justify-between gap-4 bg-surface border border-border shadow-sm">
          <div className="flex items-center gap-3 min-w-[280px] flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alarms by Conveyor, Joint, or Issue detail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 pl-10 pr-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="size-3.5" /> Severity Filter:
            </span>
            {(["all", "critical", "high", "warning", "info"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                  filter === s
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* SCADA TELEMETRY DATA MATRIX TABLE */}
        <div className="panel overflow-hidden border border-border shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/80 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Timestamp</th>
                  <th className="px-5 py-4">Conveyor Node</th>
                  <th className="px-5 py-4">Splice Joint</th>
                  <th className="px-5 py-4">Severity</th>
                  <th className="px-5 py-4">Anomaly Event</th>
                  <th className="px-5 py-4">SCADA Diagnostic Detail</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className={`transition-colors hover:bg-primary-soft/10 ${
                      a.acknowledged ? "opacity-60 bg-secondary/20" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-info" />
                        {a.time}
                      </div>
                    </td>
                    <td
                      className="px-5 py-4 font-mono font-bold text-primary cursor-pointer hover:underline"
                      onClick={() => handleInspect(a.conveyorId, a.jointId)}
                    >
                      {a.conveyorId}
                    </td>
                    <td
                      className="px-5 py-4 font-mono font-bold cursor-pointer hover:underline"
                      onClick={() => handleInspect(a.conveyorId, a.jointId)}
                    >
                      {a.jointId}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={a.severity} />
                    </td>
                    <td className="px-5 py-4 font-bold text-foreground">{a.issue}</td>
                    <td className="px-5 py-4 text-xs text-stone-700 max-w-sm truncate font-mono">
                      {a.detail}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInspect(a.conveyorId, a.jointId)}
                          className="rounded-xl font-bold text-xs gap-1"
                        >
                          Inspect <ArrowUpRight className="size-3.5" />
                        </Button>

                        {!a.acknowledged ? (
                          <Button
                            size="sm"
                            onClick={() => acknowledge(a.id)}
                            className="rounded-xl bg-primary font-bold text-xs shadow-xs hover:bg-primary/90"
                          >
                            Acknowledge
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-healthy bg-healthy-soft px-2.5 py-1 rounded-lg border border-healthy/30">
                            <CheckCircle2 className="size-3.5" /> Acknowledged
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground font-mono text-xs">
                      No SCADA alarm signals match the active filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
