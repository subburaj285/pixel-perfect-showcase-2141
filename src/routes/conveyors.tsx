import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { StatusPill } from "@/components/status";

export const Route = createFileRoute("/conveyors")({
  component: ConveyorsPage,
});

function ConveyorsPage() {
  const { conveyors, statusFilter, setStatusFilter, selectConveyor, lastUpdate, alerts } = useSystem();
  const navigate = useNavigate();

  const filtered = statusFilter === "all" ? conveyors : conveyors.filter((c) => c.status === statusFilter);

  const handleRowClick = (id: string) => {
    selectConveyor(id);
    navigate({ to: "/live-monitor" });
  };

  return (
    <AppShell title="Conveyors" subtitle="Overview of all conveyor systems">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(["all", "healthy", "warning", "high", "critical"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  statusFilter === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filtered.length} conveyors</div>
        </div>

        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Conveyor ID</th>
                  <th className="px-4 py-3 font-medium">Name / Route</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Health Score</th>
                  <th className="px-4 py-3 font-medium">Load</th>
                  <th className="px-4 py-3 font-medium">Speed</th>
                  <th className="px-4 py-3 font-medium">Active Alert</th>
                  <th className="px-4 py-3 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => {
                  const alert = alerts.find((a) => a.conveyorId === c.id && !a.acknowledged);
                  const worstJoint = c.joints.reduce((min, j) => (j.health < min.health ? j : min), c.joints[0]);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleRowClick(c.id)}
                      className="cursor-pointer transition-colors hover:bg-accent/50"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-primary">{c.id}</td>
                      <td className="px-4 py-3">{c.route}</td>
                      <td className="px-4 py-3">Plant 1</td>
                      <td className="px-4 py-3">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-4 py-3 font-mono">{worstJoint.health}%</td>
                      <td className="px-4 py-3 font-mono">{c.load}%</td>
                      <td className="px-4 py-3 font-mono">{c.speed} m/s</td>
                      <td className="px-4 py-3">
                        {alert ? (
                          <span className="text-critical">{alert.issue}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{lastUpdate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No conveyors match the current filter.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
