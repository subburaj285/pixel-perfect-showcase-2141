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
  Gauge,
  FileCheck2,
  SlidersHorizontal,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { predictions, type Prediction, type Status } from "@/lib/mock-data";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ai-predictions")({
  component: AIPredictionsPage,
});

const PROFESSIONAL_SOPS: Record<string, string[]> = {
  "Splice Delamination": [
    "Execute Lockout/Tagout (LOTO) on conveyor main drive power circuit.",
    "Conduct ultrasonic non-destructive testing (NDT) across joint splice core.",
    "Verify top and bottom cover rubber adhesion integrity and cord alignment.",
    "Re-vulcanize or replace damaged splice segment prior to restarting production.",
  ],
  "Vibration Anomaly": [
    "Deploy portable triaxial accelerometer to measure harmonic vibration spectrum.",
    "Inspect drive pulley bearings, idler rollers, and structural mounting bolts.",
    "Verify belt tension balance across take-up pulley assembly.",
    "Re-align out-of-spec idler frames to mitigate harmonic resonance.",
  ],
  "Tracking Misalignment": [
    "Inspect training idlers and self-aligning return rolls for mechanical binding.",
    "Check drive and tail pulley squareness against conveyor centerline.",
    "Audit material loading chute centering to prevent asymmetric belt loading.",
    "Adjust training idler tilt angles within ±2° operational tolerance.",
  ],
};

function AIPredictionsPage() {
  const { selectConveyor } = useSystem();
  const navigate = useNavigate();

  const [selectedPrediction, setSelectedPrediction] = useState<Prediction>(predictions[0]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "matrix">("split");
  const [activeTab, setActiveTab] = useState<"diagnostics" | "sop">("diagnostics");

  const filteredPredictions = predictions.filter((p) => {
    const matchesSeverity = severityFilter === "all" || p.severity === severityFilter;
    const matchesSearch =
      p.conveyorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jointId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.failureType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleInspect3D = (conveyorId: string, jointId: string) => {
    selectConveyor(conveyorId, jointId);
    navigate({ to: "/belt-joints" });
  };

  const criticalCount = predictions.filter((p) => p.severity === "critical").length;
  const highCount = predictions.filter((p) => p.severity === "high").length;
  const warningCount = predictions.filter((p) => p.severity === "warning").length;

  const getSopSteps = (failureType: string) => {
    for (const key in PROFESSIONAL_SOPS) {
      if (failureType.toLowerCase().includes(key.toLowerCase())) {
        return PROFESSIONAL_SOPS[key];
      }
    }
    return PROFESSIONAL_SOPS["Splice Delamination"];
  };

  return (
    <AppShell
      title="AI Predictive Diagnostics Control Room"
      subtitle="Neural network joint failure forecasting, SCADA sensor anomaly correlation, and prescriptive maintenance protocols"
    >
      <div className="space-y-6">
        {/* EXECUTIVE INDUSTRIAL METRIC HEADER */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-primary-soft/20 border-l-4 border-l-primary flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Active ML Telemetry Nodes
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-foreground">12 / 12</div>
              <div className="text-[11px] text-healthy font-semibold mt-1 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-healthy animate-pulse" /> 100% Model Edge Sync
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20 shadow-xs">
              <BrainCircuit className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-critical-soft/20 border-l-4 border-l-critical flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Critical Splice Hazards (P1)
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-critical">{criticalCount} Events</div>
              <div className="text-[11px] text-critical font-semibold mt-1">
                Immediate LOTO Inspection Required
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-critical-soft text-critical flex items-center justify-center border border-critical/20 shadow-xs">
              <ShieldAlert className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-risk-soft/20 border-l-4 border-l-risk flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Elevated Anomaly Signatures (P2)
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-risk">{highCount} Events</div>
              <div className="text-[11px] text-risk font-semibold mt-1">
                Action Window &lt; 48 Hours
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-risk-soft text-risk flex items-center justify-center border border-risk/20 shadow-xs">
              <Flame className="size-6" />
            </div>
          </div>

          <div className="panel p-4 bg-gradient-to-br from-surface via-surface to-warning-soft/20 border-l-4 border-l-warning flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Neural Confidence Calibration
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-warning">96.4%</div>
              <div className="text-[11px] text-muted-foreground font-semibold mt-1">
                ISO 10816 Standard Compliant
              </div>
            </div>
            <div className="size-11 rounded-2xl bg-warning-soft text-warning flex items-center justify-center border border-warning/20 shadow-xs">
              <Gauge className="size-6" />
            </div>
          </div>
        </div>

        {/* INDUSTRIAL SEARCH & SEVERITY FILTER TOOLBAR */}
        <div className="panel p-4 flex flex-wrap items-center justify-between gap-4 bg-surface border border-border shadow-sm">
          <div className="flex items-center gap-3 min-w-[280px] flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Conveyor ID, Joint Designation, or Failure Signature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 pl-10 pr-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="size-3.5" /> Severity Band:
            </span>
            {[
              { id: "all", label: "All Events" },
              { id: "critical", label: "Critical (P1)" },
              { id: "high", label: "High (P2)" },
              { id: "warning", label: "Warning (P3)" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSeverityFilter(id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  severityFilter === id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {label}
              </button>
            ))}

            <div className="ml-3 flex items-center border-l border-border pl-3 gap-1">
              <button
                onClick={() => setViewMode("split")}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "split" ? "bg-primary text-primary-foreground shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                title="Split Diagnostic View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("matrix")}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "matrix" ? "bg-primary text-primary-foreground shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                title="SCADA Telemetry Matrix View"
              >
                <TableProperties className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE CONTENT LAYOUT */}
        {viewMode === "split" ? (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* LEFT COLUMN: Detected Failure Signatures */}
            <div className="space-y-3 lg:col-span-5 xl:col-span-5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Active Anomaly Signatures ({filteredPredictions.length})
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">Select card for SCADA analysis</span>
              </div>

              {filteredPredictions.map((p) => {
                const isSelected = selectedPrediction.conveyorId === p.conveyorId && selectedPrediction.jointId === p.jointId;
                return (
                  <div
                    key={`${p.conveyorId}-${p.jointId}`}
                    onClick={() => setSelectedPrediction(p)}
                    className={`panel p-4 cursor-pointer transition-all border ${
                      isSelected
                        ? "border-primary bg-primary-soft/10 ring-2 ring-primary/30 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-secondary font-mono font-bold text-xs text-primary border border-border">
                          {p.conveyorId}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-foreground leading-tight">{p.failureType}</div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            Splice Joint <span className="font-bold text-foreground">{p.jointId}</span>
                          </div>
                        </div>
                      </div>
                      <StatusPill status={p.severity} />
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Failure Risk:</span>
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
                        Window: {p.windowLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Formal SCADA Diagnostic & SOP Panel */}
            <div className="lg:col-span-7 xl:col-span-7 sticky top-20">
              <div className="panel overflow-hidden border border-border shadow-xl bg-surface">
                {/* Panel Header Bar */}
                <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-secondary/80 via-surface to-secondary/40 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary/30 shadow-xs">
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        SCADA Neural Diagnostic Analysis
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Conveyor System {selectedPrediction.conveyorId} • Splice Joint {selectedPrediction.jointId}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleInspect3D(selectedPrediction.conveyorId, selectedPrediction.jointId)}
                    className="rounded-xl bg-primary text-primary-foreground font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm hover:bg-primary/90"
                  >
                    Inspect 3D CAD <ArrowUpRight className="size-4" />
                  </Button>
                </div>

                {/* Tab Navigation Bar */}
                <div className="flex items-center border-b border-border bg-secondary/20 px-5">
                  <button
                    onClick={() => setActiveTab("diagnostics")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "diagnostics"
                        ? "border-primary text-primary bg-surface"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BarChart3 className="size-4" /> Root Cause & Telemetry Correlation
                  </button>
                  <button
                    onClick={() => setActiveTab("sop")}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                      activeTab === "sop"
                        ? "border-primary text-primary bg-surface"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileCheck2 className="size-4" /> Standard Operating Procedure (SOP)
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "diagnostics" ? (
                    <div className="space-y-6">
                      {/* Gauge & Metric Grid */}
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
                                  Probability
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                              Diagnostic Failure Mode
                            </span>
                            <span className="font-black text-critical text-base block leading-tight">
                              {selectedPrediction.failureType}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                              Action Time Window
                            </span>
                            <span className="font-mono font-bold text-foreground text-sm block">
                              {selectedPrediction.windowLabel}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                              Primary SCADA Cause
                            </span>
                            <span className="font-semibold text-stone-800 text-xs block">
                              {selectedPrediction.mainCause}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                              Prescriptive Recommendation
                            </span>
                            <span className="font-bold text-primary text-xs block">
                              {selectedPrediction.recommendation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sensor Anomaly Factors */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Sparkles className="size-4 text-primary" /> Multi-Sensor Correlation Factors
                        </h4>
                        <div className="grid gap-2">
                          {selectedPrediction.factors.map((factor, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-secondary/40 p-3 rounded-xl border border-border text-xs font-semibold text-foreground"
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-critical-soft text-critical font-bold text-[11px]">
                                {i + 1}
                              </span>
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Inspect Action CTA */}
                      <div className="pt-2">
                        <Button
                          onClick={() => handleInspect3D(selectedPrediction.conveyorId, selectedPrediction.jointId)}
                          className="w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 text-sm shadow-md hover:bg-primary/90"
                        >
                          Open Joint {selectedPrediction.jointId} 3D CAD Telemetry Diagram
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* SOP TAB CONTENT */
                    <div className="space-y-5">
                      <div className="rounded-xl border border-primary/30 bg-primary-soft/20 p-4">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-primary uppercase tracking-wider mb-1">
                          <FileCheck2 className="size-4" /> Plant Maintenance SOP Protocol
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Mandatory technical maintenance procedure for resolving{" "}
                          <span className="font-bold text-foreground">{selectedPrediction.failureType}</span> on{" "}
                          <span className="font-mono font-bold text-foreground">{selectedPrediction.conveyorId}</span> (Joint{" "}
                          <span className="font-mono font-bold text-foreground">{selectedPrediction.jointId}</span>).
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                          Sequential Maintenance Steps:
                        </h4>
                        <div className="space-y-2.5">
                          {getSopSteps(selectedPrediction.failureType).map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 bg-surface p-3.5 rounded-xl border border-border shadow-xs"
                            >
                              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-healthy-soft text-healthy font-extrabold text-xs mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="text-xs font-semibold text-stone-800 leading-relaxed">
                                {step}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3">
                        <Button
                          onClick={() => handleInspect3D(selectedPrediction.conveyorId, selectedPrediction.jointId)}
                          className="w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 text-sm shadow-md hover:bg-primary/90"
                        >
                          Dispatch Work Order for Joint {selectedPrediction.jointId}
                        </Button>
                      </div>
                    </div>
                  )}
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
                    <th className="px-5 py-4">Conveyor ID</th>
                    <th className="px-5 py-4">Splice Joint</th>
                    <th className="px-5 py-4">Failure Signature</th>
                    <th className="px-5 py-4">Probability Risk</th>
                    <th className="px-5 py-4">Time Horizon</th>
                    <th className="px-5 py-4">Severity Band</th>
                    <th className="px-5 py-4">Primary SCADA Cause</th>
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
                        <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs gap-1">
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
