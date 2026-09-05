import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { SensorCard } from "@/components/SensorCard";
import { ConveyorPicker } from "@/components/ConveyorPicker";
import { StatusPill } from "@/components/status";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/live-monitor")({
  component: LiveMonitorPage,
});

function LiveMonitorPage() {
  const { conveyors, selectedConveyorId, live, trend } = useSystem();
  
  const conveyor = conveyors.find((c) => c.id === selectedConveyorId)!;
  const sensors = live[conveyor.id] ?? conveyor.sensors;

  const charts = [
    { key: "vibration", name: "Vibration", color: "#e11d48", domain: [0, 15] },
    { key: "temperature", name: "Temperature", color: "#16a34a", domain: [40, 90] },
    { key: "tension", name: "Tension", color: "#d97706", domain: [50, 100] },
    { key: "acoustic", name: "Acoustic", color: "#8b5cf6", domain: [60, 100] },
  ] as const;

  return (
    <AppShell title="Live Monitor" subtitle="Real-time telemetry and streaming sensor data">
      <div className="space-y-4">
        <div className="panel p-4 flex flex-wrap items-center gap-4">
          <ConveyorPicker className="w-[300px]" />
          <StatusPill status={conveyor.status} />
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-critical"></span>
            </span>
            <span className="font-mono text-muted-foreground">Streaming live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {sensors.map((s) => (
            <SensorCard key={s.key} reading={s} />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {charts.map((chart) => (
            <div key={chart.key} className="panel p-4">
              <h3 className="panel-title mb-4">{chart.name} Trend</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="t" 
                      stroke="var(--muted-foreground)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      domain={chart.domain}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: 6 }}
                      itemStyle={{ color: "var(--foreground)" }}
                      labelStyle={{ color: "var(--muted-foreground)" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={chart.key} 
                      stroke={chart.color} 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
