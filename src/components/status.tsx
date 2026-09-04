import { cn } from "@/lib/utils";
import type { Severity, Status } from "@/lib/mock-data";

type Tone = "healthy" | "warning" | "risk" | "critical" | "info";

const toneOf: Record<Status | Severity, Tone> = {
  healthy: "healthy",
  warning: "warning",
  high: "risk",
  critical: "critical",
  info: "info",
};

const labelOf: Record<Status | Severity, string> = {
  healthy: "Healthy",
  warning: "Warning",
  high: "High",
  critical: "Critical",
  info: "Info",
};

const toneClass: Record<Tone, string> = {
  healthy: "bg-healthy-soft text-healthy border-healthy/25",
  warning: "bg-warning-soft text-warning border-warning/30",
  risk: "bg-risk-soft text-risk border-risk/30",
  critical: "bg-critical-soft text-critical border-critical/30",
  info: "bg-info-soft text-info border-info/25",
};

const dotClass: Record<Tone, string> = {
  healthy: "bg-healthy",
  warning: "bg-warning",
  risk: "bg-risk",
  critical: "bg-critical",
  info: "bg-info",
};

export function toneFor(s: Status | Severity): Tone {
  return toneOf[s];
}

export function StatusDot({ status, className }: { status: Status | Severity; className?: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", dotClass[toneOf[status]], className)} />;
}

export function StatusPill({
  status,
  label,
  className,
}: {
  status: Status | Severity;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-semibold",
        toneClass[toneOf[status]],
        className,
      )}
    >
      <StatusDot status={status} className="size-1.5" />
      {label ?? labelOf[status]}
    </span>
  );
}

export function SensorStatusPill({ status }: { status: "Normal" | "Warning" | "High" | "Abnormal" }) {
  const tone: Tone =
    status === "Normal" ? "healthy" : status === "Warning" ? "warning" : status === "High" ? "risk" : "critical";
  return (
    <span className={cn("inline-flex rounded border px-2 py-0.5 text-xs font-semibold", toneClass[tone])}>
      {status}
    </span>
  );
}

export function healthTone(health: number): Tone {
  if (health >= 85) return "healthy";
  if (health >= 65) return "warning";
  if (health >= 50) return "risk";
  return "critical";
}

export function HealthBar({ value }: { value: number }) {
  const tone = healthTone(value);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", dotClass[tone])} style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums">{value}%</span>
    </div>
  );
}
