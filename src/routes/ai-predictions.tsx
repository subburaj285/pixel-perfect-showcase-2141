import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { predictions } from "@/lib/mock-data";
import { StatusPill } from "@/components/status";

export const Route = createFileRoute("/ai-predictions")({
  component: AIPredictionsPage,
});

function AIPredictionsPage() {
  const { selectConveyor } = useSystem();
  const navigate = useNavigate();

  const handleRowClick = (conveyorId: string, jointId: string) => {
    selectConveyor(conveyorId, jointId);
    navigate({ to: "/belt-joints" });
  };

  return (
    <AppShell title="AI Predictions" subtitle="Machine learning failure predictions across all conveyors">
      <div className="space-y-4">
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Conveyor</th>
                  <th className="px-4 py-3 font-medium">Joint</th>
                  <th className="px-4 py-3 font-medium">Failure Type</th>
                  <th className="px-4 py-3 font-medium">Probability</th>
                  <th className="px-4 py-3 font-medium">Estimated Time</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Main Cause</th>
                  <th className="px-4 py-3 font-medium">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {predictions.map((p, i) => (
                  <tr
                    key={i}
                    onClick={() => handleRowClick(p.conveyorId, p.jointId)}
                    className="cursor-pointer transition-colors hover:bg-accent/50"
                  >
                    <td className="px-4 py-4 font-mono font-medium text-primary">{p.conveyorId}</td>
                    <td className="px-4 py-4 font-mono font-medium">{p.jointId}</td>
                    <td className="px-4 py-4">{p.failureType}</td>
                    <td className="px-4 py-4">
                      <span className={`font-mono font-bold ${p.probability > 75 ? "text-critical" : p.probability > 50 ? "text-risk" : "text-warning"}`}>
                        {p.probability}%
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono">{p.windowLabel}</td>
                    <td className="px-4 py-4">
                      <StatusPill status={p.severity} />
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{p.mainCause}</td>
                    <td className="px-4 py-4">{p.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {predictions.map((p, i) => (
            <div key={i} className="panel p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-lg">{p.failureType}</div>
                  <div className="text-xs text-muted-foreground">{p.conveyorId} · Joint {p.jointId}</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-2xl font-bold ${p.probability > 75 ? "text-critical" : p.probability > 50 ? "text-risk" : "text-warning"}`}>
                    {p.probability}%
                  </div>
                </div>
              </div>
              <div className="rounded border border-border bg-secondary p-3 mb-3">
                <div className="text-xs font-semibold mb-2">Key Factors:</div>
                <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                  {p.factors.slice(0, 3).map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-primary">Recommendation:</span> {p.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
