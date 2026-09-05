import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { ConveyorPicker } from "@/components/ConveyorPicker";
import { JointTrack } from "@/components/JointTrack";
import { StatusPill } from "@/components/status";
import { getPrediction } from "@/lib/mock-data";

export const Route = createFileRoute("/belt-joints")({
  component: BeltJointsPage,
});

function BeltJointsPage() {
  const { conveyors, selectedConveyorId, selectedJointId, selectJoint } = useSystem();
  
  const conveyor = conveyors.find((c) => c.id === selectedConveyorId)!;
  const joint = conveyor.joints.find((j) => j.id === selectedJointId) ?? conveyor.joints[0];
  const prediction = getPrediction(conveyor.id);

  return (
    <AppShell title="Belt Joints" subtitle="Monitor individual belt joints and splices">
      <div className="space-y-4">
        <div className="panel p-4 flex flex-wrap items-center gap-4">
          <ConveyorPicker className="w-[300px]" />
          <StatusPill status={conveyor.status} />
        </div>

        <div className="panel p-4">
          <h2 className="panel-title mb-4">Joint Health Map</h2>
          <JointTrack joints={conveyor.joints} selectedId={joint.id} onSelect={selectJoint} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel p-4">
            <h2 className="panel-title mb-4">Joint Details: {joint.id}</h2>
            <dl className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <dt className="label-caps">Conveyor</dt>
                <dd className="font-mono font-medium">{conveyor.id}</dd>
              </div>
              <div>
                <dt className="label-caps">Status</dt>
                <dd className="mt-1"><StatusPill status={joint.status} /></dd>
              </div>
              <div>
                <dt className="label-caps">Position</dt>
                <dd className="font-mono font-medium">{joint.positionM.toLocaleString()} m</dd>
              </div>
              <div>
                <dt className="label-caps">Health Score</dt>
                <dd className="font-mono font-medium">{joint.health}%</dd>
              </div>
              <div className="col-span-2">
                <dt className="label-caps">Condition</dt>
                <dd className="font-medium text-foreground">{joint.condition}</dd>
              </div>
            </dl>
          </div>

          <div className="panel p-4">
            <h2 className="panel-title mb-4">AI Prediction (Joint {joint.id})</h2>
            {prediction && prediction.jointId === joint.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 shrink-0 grid place-items-center">
                    <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted/30"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={prediction.probability > 75 ? "text-critical" : "text-risk"}
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${prediction.probability}, 100`}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="font-mono font-bold text-lg">{prediction.probability}%</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{prediction.type}</div>
                    <div className="text-xs text-muted-foreground mt-1">Est. Time: <span className="font-mono">{prediction.estimatedTime}</span></div>
                  </div>
                </div>
                <div className="rounded border border-border bg-secondary p-3">
                  <div className="text-xs font-semibold mb-2">Key Factors:</div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                    {prediction.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No active AI failure prediction for {joint.id}.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
