import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

  const handleRowClick = (conveyorId: string, jointId: string) => {
    selectConveyor(conveyorId, jointId);
    navigate({ to: "/live-monitor" });
  };

  return (
    <AppShell title="Alerts Management" subtitle="System alerts, anomalies and warnings">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(["all", "critical", "high", "warning", "info"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filtered.length} alerts</div>
        </div>

        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Conveyor</th>
                  <th className="px-4 py-3 font-medium">Joint</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Issue</th>
                  <th className="px-4 py-3 font-medium">Detail</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className={`transition-colors hover:bg-accent/50 ${a.acknowledged ? "opacity-50" : ""}`}
                  >
                    <td 
                      className="px-4 py-4 font-mono text-muted-foreground cursor-pointer"
                      onClick={() => handleRowClick(a.conveyorId, a.jointId)}
                    >
                      {a.time}
                    </td>
                    <td 
                      className="px-4 py-4 font-mono font-medium text-primary cursor-pointer"
                      onClick={() => handleRowClick(a.conveyorId, a.jointId)}
                    >
                      {a.conveyorId}
                    </td>
                    <td 
                      className="px-4 py-4 font-mono font-medium cursor-pointer"
                      onClick={() => handleRowClick(a.conveyorId, a.jointId)}
                    >
                      {a.jointId}
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={a.severity} />
                    </td>
                    <td className="px-4 py-4 font-medium">{a.issue}</td>
                    <td className="px-4 py-4 text-muted-foreground">{a.detail}</td>
                    <td className="px-4 py-4 text-right">
                      {!a.acknowledged ? (
                        <Button variant="outline" size="sm" onClick={() => acknowledge(a.id)}>
                          Acknowledge
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground pr-4">Acknowledged</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No alerts match the current filter.
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
