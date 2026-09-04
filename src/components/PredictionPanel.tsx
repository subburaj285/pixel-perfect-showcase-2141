import { useState } from "react";
import { AlertTriangle, BrainCircuit, CheckCircle2, ChevronRight, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { StatusPill } from "./status";
import type { Conveyor, Joint, Prediction } from "@/lib/mock-data";

const ACTIONS = [
  "Inspect the flagged joint immediately",
  "Verify splice condition and bonding",
  "Check belt tension against operating band",
  "Check alignment and training idlers",
  "Reduce conveyor load if operationally appropriate",
  "Schedule maintenance within the predicted window",
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
      <section className="panel p-4">
        <div className="mb-2 flex items-center gap-2">
          <BrainCircuit className="size-4 text-primary" />
          <h2 className="panel-title">AI Failure Prediction</h2>
        </div>
        <div className="rounded border border-healthy/25 bg-healthy-soft p-4 text-sm text-healthy">
          No failure signature detected on {conveyor.id}. All joints are within tolerance and the model reports a
          residual risk below 10%.
        </div>
      </section>
    );
  }

  const ring = `conic-gradient(var(--critical) ${prediction.probability * 3.6}deg, var(--muted) 0deg)`;

  return (
    <section className="panel overflow-hidden">
      <header className="flex items-center gap-2 border-b border-border bg-critical-soft px-4 py-2.5">
        <AlertTriangle className="size-4 text-critical" />
        <h2 className="panel-title text-critical">AI Failure Prediction</h2>
        <StatusPill status={prediction.severity} className="ml-auto" />
      </header>

      <div className="grid gap-4 p-4 sm:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-3">
          <div className="grid size-24 place-items-center rounded-full" style={{ background: ring }}>
            <div className="grid size-18 place-items-center rounded-full bg-surface">
              <span className="font-mono text-xl font-bold text-critical">{prediction.probability}%</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Probability
            <br />
            of failure
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="label-caps">Predicted failure</dt>
            <dd className="font-semibold text-critical">{prediction.failureType}</dd>
          </div>
          <div>
            <dt className="label-caps">Estimated window</dt>
            <dd className="font-semibold">{prediction.windowLabel}</dd>
          </div>
          <div>
            <dt className="label-caps">Failure location</dt>
            <dd className="flex items-center gap-1 font-semibold">
              <MapPin className="size-3.5 text-critical" />
              Joint {prediction.jointId}
            </dd>
          </div>
          <div>
            <dt className="label-caps">Belt position</dt>
            <dd className="font-mono font-semibold">
              {(joint?.positionM ?? 0).toLocaleString()} m<span className="ml-1 text-xs font-normal text-muted-foreground">from drive pulley</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-4 pb-4">
        <Button variant="outline" size="sm" onClick={() => setExplain((v) => !v)} className="w-full justify-between">
          Why this prediction?
          <ChevronRight className={explain ? "size-4 rotate-90 transition-transform" : "size-4 transition-transform"} />
        </Button>
        {explain && (
          <ul className="mt-2 space-y-1.5 rounded border border-critical/20 bg-critical-soft p-3 text-sm">
            {prediction.factors.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-critical" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-2 flex items-center gap-2">
          <Wrench className="size-4 text-primary" />
          <h3 className="panel-title">Recommended action</h3>
        </div>
        <ul className="space-y-1.5 text-sm">
          {ACTIONS.map((a) => (
            <li key={a} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-healthy" />
              {a.replace("the flagged joint", `joint ${prediction.jointId}`)}
            </li>
          ))}
        </ul>
        <CreateTaskDialog
          conveyorId={conveyor.id}
          jointId={prediction.jointId}
          defaultTitle={prediction.recommendation}
          defaultPriority={prediction.severity}
          trigger={<Button className="mt-3 w-full">Create maintenance task</Button>}
        />
      </div>
    </section>
  );
}
