import { cn } from "@/lib/utils";
import type { Joint } from "@/lib/mock-data";
import { StatusDot, toneFor } from "./status";

const ringTone = {
  healthy: "ring-healthy/30",
  warning: "ring-warning/40",
  risk: "ring-risk/40",
  critical: "ring-critical/50",
} as const;

export function JointTrack({
  joints,
  selectedId,
  onSelect,
}: {
  joints: Joint[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative overflow-x-auto pb-1">
      <div className="relative flex min-w-full items-start justify-between gap-4 px-2 pt-6">
        <div className="absolute top-9 right-4 left-4 h-0.5 bg-border" />
        {joints.map((j) => {
          const tone = toneFor(j.status);
          const selected = j.id === selectedId;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => onSelect(j.id)}
              className="relative z-10 flex min-w-24 flex-col items-center gap-1 text-center"
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full bg-surface ring-4 transition-transform",
                  ringTone[tone as keyof typeof ringTone],
                  selected && "scale-125",
                )}
              >
                <StatusDot status={j.status} className="size-4" />
              </span>
              <span className={cn("mt-1 font-mono text-xs font-semibold", selected && "underline")}>{j.id}</span>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  tone === "healthy" && "text-healthy",
                  tone === "warning" && "text-warning",
                  tone === "risk" && "text-risk",
                  tone === "critical" && "text-critical",
                )}
              >
                {j.status === "high" ? "High Risk" : j.status[0].toUpperCase() + j.status.slice(1)}
              </span>
              <span className="text-[11px] text-muted-foreground">{j.positionM.toLocaleString()} m</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
