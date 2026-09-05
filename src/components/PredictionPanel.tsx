import { useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Wrench,
  Sparkles,
  Zap,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { StatusPill } from "./status";
import type { Conveyor, Joint, Prediction } from "@/lib/mock-data";

const ACTIONS = [
  "Inspect the flagged joint immediately",
  "Verify splice condition and bonding integrity",
  "Check belt tension against operating band",
  "Inspect alignment and training idler bearings",
  "Reduce conveyor load if operationally appropriate",
  "Schedule maintenance within predicted window",
];

export function PredictionPanel({
  conveyor,
  joint,
  prediction,
}: {
  conveyor: Conveyor;
  joint: Joint | undefined;
  prediction: Prediction | null;
}) {
  const [explain, setExplain] = useState(true);

  if (!prediction) {
    return (
      <section className="panel p-5 overflow-hidden border border-healthy/30 bg-gradient-to-br from-surface to-healthy-soft/20 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-healthy-soft text-healthy border border-healthy/30">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <h2 className="panel-title text-base">AI Failure Prediction</h2>
            <p className="text-xs text-muted-foreground">Neural Telemetry Engine v2.4</p>
          </div>
        </div>
        <div className="rounded-xl border border-healthy/30 bg-healthy-soft/50 p-4 text-sm text-healthy flex items-start gap-3">
          <Sparkles className="size-5 shrink-0 text-healthy mt-0.5" />
          <div>
            <span className="font-bold">No Critical Failure Signature Detected</span>
            <p className="mt-1 text-xs text-healthy/90 leading-relaxed">
              Conveyor <span className="font-mono font-bold">{conveyor.id}</span> joints operate within normal baseline tolerances. Model residual risk is below 10%.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const ring = `conic-gradient(var(--${prediction.probability > 75 ? "critical" : prediction.probability > 50 ? "risk" : "warning"}) ${prediction.probability * 3.6}deg, rgba(229, 231, 235, 0.3) 0deg)`;

  return (
    <section className="panel overflow-hidden border border-border shadow-lg bg-surface">
      {/* UNIQUE FUTURISTIC HEADER */}
      <header className="flex items-center justify-between border-b border-border bg-gradient-to-r from-critical-soft via-surface to-critical-soft/30 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-critical-soft text-critical border border-critical/30 shadow-xs">
            <span className="absolute inline-flex size-full rounded-xl bg-critical opacity-20 animate-ping" />
            <BrainCircuit className="relative size-5 text-critical" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="panel-title text-base text-foreground font-bold">
                AI Predictive Failure Diagnostics
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-critical-soft px-2 py-0.5 text-[10px] font-extrabold text-critical border border-critical/30">
                <Zap className="size-3" /> LIVE AI MODEL
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Real-time neural pattern recognition across sensors</p>
          </div>
        </div>
        <StatusPill status={prediction.severity} />
      </header>

      {/* UNIQUE ALIGNED 2-COLUMN DISPLAY */}
      <div className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] items-center">
        {/* Left: Dynamic Radial Gauge */}
        <div className="flex flex-col items-center justify-center bg-secondary/30 p-4 rounded-2xl border border-border">
          <div className="relative grid size-28 place-items-center rounded-full p-1 shadow-md" style={{ background: ring }}>
            <div className="grid size-22 place-items-center rounded-full bg-surface shadow-inner">
              <div className="text-center">
                <span className={`font-mono text-2xl font-black ${prediction.probability > 75 ? "text-critical" : prediction.probability > 50 ? "text-risk" : "text-warning"}`}>
                  {prediction.probability}%
                </span>
                <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Probability
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Clean 2x2 Metric Grid Alignment */}
        <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-2xl border border-border">
          <div className="space-y-1">
            <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
              <AlertTriangle className="size-3.5 text-critical" /> Predicted Failure
            </dt>
            <dd className="font-extrabold text-critical text-base leading-tight">{prediction.failureType}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
              <Activity className="size-3.5 text-info" /> Estimated Window
            </dt>
            <dd className="font-bold text-foreground text-sm font-mono">{prediction.windowLabel}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
              <MapPin className="size-3.5 text-critical" /> Failure Location
            </dt>
            <dd className="font-bold text-foreground text-sm flex items-center gap-1">
              Joint <span className="font-mono text-primary font-extrabold">{prediction.jointId}</span>
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
              <ArrowUpRight className="size-3.5 text-muted-foreground" /> Belt Position
            </dt>
            <dd className="font-mono font-bold text-foreground text-sm">
              {(joint?.positionM ?? 0).toLocaleString()} m
              <span className="block text-[10px] font-normal text-muted-foreground">from drive pulley</span>
            </dd>
          </div>
        </div>
      </div>

      {/* EXPANDABLE AI DIAGNOSTIC BREAKDOWN */}
      <div className="px-5 pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExplain((v) => !v)}
          className="w-full justify-between rounded-xl border-border bg-secondary/40 hover:bg-secondary text-xs font-bold py-2"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Neural Network Anomaly Explanation
          </span>
          <ChevronRight className={explain ? "size-4 rotate-90 transition-transform" : "size-4 transition-transform"} />
        </Button>
        {explain && (
          <div className="mt-3 space-y-2 rounded-xl border border-critical/30 bg-critical-soft/40 p-4 text-xs">
            <div className="font-extrabold text-critical uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-critical animate-pulse" />
              Primary Sensor Anomaly Factors Detected:
            </div>
            <ul className="space-y-2">
              {prediction.factors.map((f) => (
                <li key={f} className="flex items-center gap-2.5 bg-surface/80 p-2.5 rounded-lg border border-critical/20 text-stone-800 font-medium shadow-2xs">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-critical text-white text-[10px] font-bold">!</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RECOMMENDED ACTION & MAINTENANCE CREATION */}
      <div className="border-t border-border p-5 bg-gradient-to-b from-surface to-secondary/30">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Wrench className="size-4" />
          </div>
          <h3 className="panel-title text-sm">Recommended Prescriptive Actions</h3>
        </div>
        <ul className="grid gap-2 text-xs sm:grid-cols-2 mb-4">
          {ACTIONS.map((a) => (
            <li key={a} className="flex gap-2 items-center bg-surface p-2 rounded-lg border border-border text-stone-700 font-medium">
              <CheckCircle2 className="size-4 shrink-0 text-healthy" />
              {a.replace("the flagged joint", `joint ${prediction.jointId}`)}
            </li>
          ))}
        </ul>
        <CreateTaskDialog
          conveyorId={conveyor.id}
          jointId={prediction.jointId}
          defaultTitle={prediction.recommendation}
          defaultPriority={prediction.severity}
          trigger={
            <Button className="w-full rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 py-2.5">
              Create AI Maintenance Task Order
            </Button>
          }
        />
      </div>
    </section>
  );
}
