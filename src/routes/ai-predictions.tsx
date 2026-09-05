import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BrainCircuit,
  Zap,
  Filter,
  Search,
  LayoutGrid,
  TableProperties,
  ArrowUpRight,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Activity,
  MapPin,
  Flame,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { predictions, getPrediction, type Prediction, type Status } from "@/lib/mock-data";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ai-predictions")({
  component: AIPredictionsPage,
});

function AIPredictionsPage() {
  const { selectConveyor, conveyors } = useSystem();
  const navigate = useNavigate();

  const [selectedPrediction, setSelectedPrediction] = useState<Prediction>(predictions[0]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "matrix">("split");

  const filteredPredictions = predictions.filter((p) => {
    const matchesSeverity = severityFilter === "all" || p.severity === severityFilter;
    const matchesSearch =
      p.conveyorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jointId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.failureType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleSelectPrediction = (p: Prediction) => {
    setSelectedPrediction(p);
  };

  const handleInspect3D = (conveyorId: string, jointId: string) => {
    selectConveyor(conveyorId, jointId);
    navigate({ to: "/belt-joints" });
  };

  const criticalCount = predictions.filter((p) => p.severity === "critical").length;
  const highCount = predictions.filter((p) => p.severity === "high").length;
  const warningCount = predictions.filter((p) => p.severity === "warning").length;

  return (
    <AppShell
      title="AI Predictive Diagnostics"
      subtitle="Neural network joint failure predictions, real-time sensor anomaly correlation, and prescriptive maintenance"
    >
      <div className="space-y-6">
        {/* HERO EXECUTIVE STATS HEADER */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="panel p-4 bg-gradient-to-br from-surface to-primary-soft/30 border-l-4 border-l-primary flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active AI Model Nodes
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-foreground">12 / 12</div>
              <div className="text-[11px] text-healthy font-semibold mt-1 flex items-center gap-1">
                <span className="size-2 rounded-full bg-healthy animate-pulse" /> 100% Neural Coverage
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
              <BrainCircuit className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface to-critical-soft/30 border-l-4 border-l-critical flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Critical Joint Risks
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-critical">{criticalCount}</div>
              <div className="text-[11px] text-critical font-semibold mt-1">
                Requires immediate action
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-critical-soft text-critical flex items-center justify-center border border-critical/20">
              <ShieldAlert className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface to-risk-soft/30 border-l-4 border-l-risk flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                High Priority Alerts
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-risk">{highCount}</div>
              <div className="text-[11px] text-risk font-semibold mt-1">
                Inspect within 48 hours
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-risk-soft text-risk flex items-center justify-center border border-risk/20">
              <Flame className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface to-warning-soft/30 border-l-4 border-l-warning flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Model Confidence Score
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-warning">96.4%</div>
              <div className="text-[11px] text-muted-foreground font-semibold mt-1">
                Edge AI Correlation Band
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-warning-soft text-warning flex items-center justify-center border border-warning/20">
              <Sparkles className="size-6" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="panel p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-[260px] flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Conveyor ID, Joint ID, or Failure Type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 pl-9 pr-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="size-3.5" /> Severity:
            </span>
            {(["all", "critical", "high", "warning"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                  severityFilter === sev
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {sev}
              </button>
            ))}

            <div className="ml-3 flex items-center border-l border-border pl-3 gap-1">
              <button
                onClick={() => setViewMode("split")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "split" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
                title="Split Master-Detail Alignment View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("matrix")}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "matrix" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
                title="Matrix Table Alignment View"
              >
                <TableProperties className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* UNIQUE ALIGNED SPLIT MASTER-DETAIL WORKSPACE */}
        {viewMode === "split" ? (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* LEFT ALIGNMENT COLUMN: AI Predictions Feed Cards */}
            <div className="space-y-3 lg:col-span-6 xl:col-span-5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Detected Failure Signatures ({filteredPredictions.length})
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">Select card for deep AI analysis</span>
              </div>

              {filteredPredictions.map((p) => {
                const isSelected = selectedPrediction.conveyorId === p.conveyorId && selectedPrediction.jointId === p.jointId;
                return (
                  <div
                    key={`${p.conveyorId}-${p.jointId}`}
                    onClick={() => handleSelectPrediction(p)}
                    className={`panel p-4 cursor-pointer transition-all border ${
                      isSelected
                        ? "border-primary bg-primary-soft/10 ring-2 ring-primary/30 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-secondary font-mono font-bold text-xs text-primary border border-border">
                          {p.conveyorId}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-foreground leading-tight">{p.failureType}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            Joint <span className="font-bold text-foreground">{p.jointId}</span> • Position {p.jointId}
                          </div>
                        </div>
                      </div>
                      <StatusPill status={p.severity} />
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Probability:</span>
                        <span
                          className={`font-mono text-base font-black ${
                            p.probability > 75 ? "text-critical" : p.probability > 50 ? "text-risk" : "text-warning"
                          }`}
                        >
                          {p.probability}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-lg">
                        <Clock className="size-3.5 text-info" />
                        {p.windowLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT ALIGNMENT COLUMN: Deep AI Neural Diagnostic Panel */}
            <div className="lg:col-span-6 xl:col-span-7 sticky top-20">
              <div className="panel overflow-hidden border border-border shadow-xl bg-surface">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-secondary/80 via-surface to-secondary/40 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary/30">
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        Neural Model Diagnostic Breakdown
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Conveyor {selectedPrediction.conveyorId} • Joint {selectedPrediction.jointId}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleInspect3D(selectedPrediction.conveyorId, selectedPrediction.jointId)}
                    className="rounded-xl bg-primary text-primary-foreground font-bold text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
                  >
                    Inspect 3D Cad <ArrowUpRight className="size-4" />
                  </Button>
                </div>

                {/* Main Diagnostic Body */}
                <div className="p-6 space-y-6">
                  {/* Gauge & Key Stats Grid */}
                  <div className="grid gap-6 sm:grid-cols-[auto_1fr] items-center bg-secondary/20 p-5 rounded-2xl border border-border">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="relative grid size-32 place-items-center rounded-full p-1 shadow-lg"
                        style={{
                          background: `conic-gradient(var(--${
                            selectedPrediction.probability > 75 ? "critical" : selectedPrediction.probability > 50 ? "risk" : "warning"
                          }) ${selectedPrediction.probability * 3.6}deg, rgba(229, 231, 235, 0.3) 0deg)`,
                        }}
                      >
                        <div className="grid size-26 place-items-center rounded-full bg-surface shadow-inner">
                          <div className="text-center">
                            <span
                              className={`font-mono text-3xl font-black ${
                                selectedPrediction.probability > 75
                                  ? "text-critical"
                                  : selectedPrediction.probability > 50
                                  ? "text-risk"
                                  : "text-warning"
                              }`}
                            >
                              {selectedPrediction.probability}%
                            </span>
                            <div className="text-[10px] font-extrabold tracking-wider text-muted-foreground uppercase">
                              Failure Risk
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Failure Mechanism
                        </span>
                        <span className="font-black text-critical text-base block leading-tight">
                          {selectedPrediction.failureType}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Predicted Window
                        </span>
                        <span className="font-mono font-bold text-foreground text-sm block">
                          {selectedPrediction.windowLabel}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Root Cause
                        </span>
                        <span className="font-semibold text-stone-700 text-xs block">
                          {selectedPrediction.mainCause}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Recommended Action
                        </span>
                        <span className="font-bold text-primary text-xs block">
                          {selectedPrediction.recommendation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Neural Anomaly Factors */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" /> Key Neural Anomaly Factors
                    </h4>
                    <div className="grid gap-2">
                      {selectedPrediction.factors.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-secondary/40 p-3 rounded-xl border border-border text-xs font-medium text-foreground"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-critical-soft text-critical font-bold text-[11px]">
                            {i + 1}
                          </span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-2">
                    <Button
                      onClick={() => handleInspect3D(selectedPrediction.conveyorId, selectedPrediction.jointId)}
                      className="w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 text-sm shadow-md hover:bg-primary/90"
                    >
                      Open Joint {selectedPrediction.jointId} Telemetry & 3D Diagram
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MATRIX TABLE ALIGNMENT VIEW */
          <div className="panel overflow-hidden border border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/80 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Conveyor</th>
                    <th className="px-5 py-4">Joint ID</th>
                    <th className="px-5 py-4">Failure Signature</th>
                    <th className="px-5 py-4">Failure Risk</th>
                    <th className="px-5 py-4">Time Horizon</th>
                    <th className="px-5 py-4">Severity</th>
                    <th className="px-5 py-4">Primary Cause</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPredictions.map((p, i) => (
                    <tr
                      key={i}
                      onClick={() => handleInspect3D(p.conveyorId, p.jointId)}
                      className="cursor-pointer transition-colors hover:bg-primary-soft/10"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-primary">{p.conveyorId}</td>
                      <td className="px-5 py-4 font-mono font-bold">{p.jointId}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">{p.failureType}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-mono text-base font-black ${
                            p.probability > 75 ? "text-critical" : p.probability > 50 ? "text-risk" : "text-warning"
                          }`}
                        >
                          {p.probability}%
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-stone-600">{p.windowLabel}</td>
                      <td className="px-5 py-4">
                        <StatusPill status={p.severity} />
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground max-w-xs truncate">{p.mainCause}</td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="outline" size="sm" className="rounded-lg font-bold text-xs gap-1">
                          Inspect <ArrowUpRight className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
