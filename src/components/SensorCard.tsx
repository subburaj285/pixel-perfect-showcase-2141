import { ArrowDown, ArrowUp, Activity, Thermometer, Gauge, Scale, Move3d, Volume2 } from "lucide-react";
import type { SensorReading } from "@/lib/mock-data";
import { SensorStatusPill } from "./status";

const ICONS = {
  vibration: Activity,
  temperature: Thermometer,
  speed: Gauge,
  tension: Scale,
  alignment: Move3d,
  acoustic: Volume2,
} as const;

export function SensorCard({ reading }: { reading: SensorReading }) {
  const Icon = ICONS[reading.key];
  const up = reading.deltaPct >= 0;
  const Trend = up ? ArrowUp : ArrowDown;
  return (
    <div className="panel p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-semibold">{reading.label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-2xl font-bold tabular-nums">{reading.value.toFixed(reading.decimals)}</span>
        <span className="text-xs text-muted-foreground">{reading.unit}</span>
      </div>
      <div className="mt-2">
        <SensorStatusPill status={reading.status} />
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Trend className="size-3" />
        <span className="font-mono">{Math.abs(reading.deltaPct)}%</span>
        <span>vs baseline</span>
      </div>
    </div>
  );
}
