import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import type { TaskStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/maintenance")({
  component: MaintenancePage,
});

const STATUSES: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All Tasks" },
  { value: "critical", label: "Critical" },
  { value: "due-today", label: "Due Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "in-progress", label: "In Progress" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

const TECHS = ["Unassigned", "R. Meena", "S. Kumar", "A. Patil", "D. Rao", "M. Singh"];

function MaintenancePage() {
  const { tasks, setTaskStatus, assignTechnician } = useSystem();
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <AppShell 
      title="Maintenance Management" 
      subtitle="Track and manage preventative and corrective maintenance tasks"
      actions={
        <CreateTaskDialog 
          conveyorId="CV-04" 
          jointId="J-23" 
          trigger={<Button size="sm">Create Task</Button>} 
        />
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === s.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filtered.length} tasks</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="panel p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs font-mono text-muted-foreground mb-1">{t.id}</div>
                  <div className="font-semibold">{t.title}</div>
                </div>
                <StatusPill status={t.priority} />
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                {t.conveyorId} · Joint {t.jointId}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="block text-xs text-muted-foreground">Due</span>
                  <span className="font-medium">{t.due}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{t.status.replace("-", " ")}</span>
                </div>
              </div>
              <div className="mt-auto space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Assignee:</span>
                  <Select value={t.technician} onValueChange={(v) => assignTechnician(t.id, v)}>
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TECHS.map((tech) => (
                        <SelectItem key={tech} value={tech} className="text-xs">{tech}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Status:</span>
                  <Select value={t.status} onValueChange={(v) => setTaskStatus(t.id, v as TaskStatus)}>
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.filter(s => s.value !== "all").map((s) => (
                        <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground panel">
              No tasks match the current filter.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
