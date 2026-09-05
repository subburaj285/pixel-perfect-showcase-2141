import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSystem } from "@/lib/system-store";
import { ConveyorPicker } from "@/components/ConveyorPicker";
import { JointTrack } from "@/components/JointTrack";
import { PredictionPanel } from "@/components/PredictionPanel";
import { StatusPill } from "@/components/status";
import { getPrediction } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Flame,
  Radio,
  RefreshCw,
  ShieldAlert,
  Zap,
  Microscope,
  FileCheck2,
  Gauge,
} from "lucide-react";

export const Route = createFileRoute("/belt-joints")({
  component: BeltJointsPage,
});

function BeltJointsPage() {
  const { conveyors, selectedConveyorId, selectedJointId, selectJoint } = useSystem();
  const [activeTab, setActiveTab] = useState<"cross-section" | "thermal" | "acoustic" | "rfid">("cross-section");
  const [isScanning, setIsScanning] = useState(true);

  const conveyor = conveyors.find((c) => c.id === selectedConveyorId) ?? conveyors[0];
  const joint = conveyor.joints.find((j) => j.id === selectedJointId) ?? conveyor.joints[0];
  const prediction = getPrediction(conveyor.id);

  const healthyCount = conveyor.joints.filter((j) => j.status === "healthy").length;
  const warningCount = conveyor.joints.filter((j) => j.status === "warning").length;
  const criticalCount = conveyor.joints.filter((j) => j.status === "critical" || j.status === "high").length;

  return (
    <AppShell
      title="Belt Joints & Splices Diagnostic Center"
      subtitle={`Real-time RFID, acoustic, thermal & AI vulcanized joint analysis for ${conveyor.id}`}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="panel p-4 flex flex-wrap items-center justify-between gap-4 bg-surface/80 backdrop-blur">
          <div className="flex items-center gap-4">
            <ConveyorPicker className="w-[280px]" />
            <StatusPill status={conveyor.status} />
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-healthy animate-pulse" />
              <span className="text-muted-foreground">Healthy Joints:</span>
              <span className="font-mono font-bold text-healthy">{healthyCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-warning" />
              <span className="text-muted-foreground">Warning:</span>
              <span className="font-mono font-bold text-warning">{warningCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-critical" />
              <span className="text-muted-foreground">Critical / Risk:</span>
              <span className="font-mono font-bold text-critical">{criticalCount}</span>
            </div>
          </div>
        </div>

        {/* Joint Health Map / Track */}
        <div className="panel p-5 bg-card/60 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="panel-title text-base flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Joint Track Map & Splice Index
              </h2>
              <p className="text-xs text-muted-foreground">
                Select any joint to inspect real-time sensor anomalies, internal vulcanization, and RFID telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsScanning((prev) => !prev)}
              >
                <RefreshCw className={`size-3.5 mr-1.5 ${isScanning ? "animate-spin text-primary" : ""}`} />
                {isScanning ? "Live Scanner Active" : "Resume Scanner"}
              </Button>
            </div>
          </div>

          {/* Track selector */}
          <JointTrack joints={conveyor.joints} selectedId={joint.id} onSelect={selectJoint} />
        </div>

        {/* Main Grid: Visual Joint Twin & AI Diagnostic Panel */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Visual Joint Digital Twin Scanner */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Visualizer Card */}
            <div className="panel p-5 space-y-5 bg-card/80 border-primary/20 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-foreground">Joint {joint.id}</span>
                    <StatusPill status={joint.status} />
                    <span className="text-xs text-muted-foreground font-mono">Position: {joint.positionM.toLocaleString()} m</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{joint.condition}</p>
                </div>
                <div className="flex items-center gap-1 bg-surface/90 rounded-lg p-1 border border-border/50 text-xs">
                  <button
                    onClick={() => setActiveTab("cross-section")}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                      activeTab === "cross-section"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Cross-Section
                  </button>
                  <button
                    onClick={() => setActiveTab("thermal")}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                      activeTab === "thermal"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Thermal X-Ray
                  </button>
                  <button
                    onClick={() => setActiveTab("acoustic")}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                      activeTab === "acoustic"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Acoustic
                  </button>
                  <button
                    onClick={() => setActiveTab("rfid")}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                      activeTab === "rfid"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    RFID Twin
                  </button>
                </div>
              </div>

              {/* View 1: Vulcanized Cross-Section Diagram */}
              {activeTab === "cross-section" && (
                <div className="space-y-4">
                  <div className="relative h-48 rounded-xl border border-border bg-gradient-to-b from-surface via-background to-surface overflow-hidden p-4 flex flex-col justify-between">
                    {/* Scanning animation laser */}
                    {isScanning && (
                      <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_15px_var(--primary)] animate-pulse left-1/3 z-20" />
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground z-10">
                      <span className="font-mono">Top Rubber Cover (8.0 mm)</span>
                      <span className="font-mono">Vulcanized Splice Zone (2,400 mm)</span>
                      <span className="font-mono">Pulley Cover (6.5 mm)</span>
                    </div>

                    {/* Visual belt ply layers */}
                    <div className="my-auto space-y-2 relative z-10">
                      {/* Top Rubber Cover */}
                      <div className="h-4 rounded bg-stone-700/80 border border-stone-600/50 flex items-center justify-between px-3 text-[10px] font-mono text-stone-300">
                        <span>Top Cover Wear: {joint.status === "critical" ? "3.2 mm (Severe)" : "0.8 mm (Normal)"}</span>
                        <span>Friction Coeff: 0.38</span>
                      </div>

                      {/* Steel Cords Core */}
                      <div
                        className={`h-10 rounded border flex items-center justify-around px-2 relative ${
                          joint.status === "critical"
                            ? "bg-critical-soft/30 border-critical/50"
                            : joint.status === "warning"
                            ? "bg-warning-soft/30 border-warning/50"
                            : "bg-healthy-soft/30 border-healthy/50"
                        }`}
                      >
                        <span className="text-[10px] font-mono font-semibold text-foreground z-10">
                          Steel Cord Plies (7.2 mm ST-4500)
                        </span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                            <div
                              key={idx}
                              className={`size-3 rounded-full border shadow-sm ${
                                joint.status === "critical" && idx === 4
                                  ? "bg-critical border-critical animate-ping"
                                  : joint.status === "critical" && (idx === 3 || idx === 5)
                                  ? "bg-warning border-warning"
                                  : "bg-emerald-400 border-emerald-300"
                              }`}
                              title={`Cord ${idx}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground z-10">
                          {joint.status === "critical" ? "Cord Separation Discovered!" : "Cords Aligned"}
                        </span>
                      </div>

                      {/* Bottom Rubber Cover */}
                      <div className="h-4 rounded bg-stone-800/90 border border-stone-700/50 flex items-center justify-between px-3 text-[10px] font-mono text-stone-400">
                        <span>Pulley Contact Surface</span>
                        <span>Bond Tension: {joint.health}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground z-10">
                      <span>Leading Edge 0 m</span>
                      <span className="text-primary font-semibold">Splice Midpoint (1,200 mm)</span>
                      <span>Trailing Edge 2.4 m</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border/80 bg-surface/50 p-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Microscope className="size-3.5 text-primary" />
                        Cord Gap Width
                      </div>
                      <div className="mt-1 text-lg font-mono font-bold text-foreground">
                        {joint.status === "critical" ? "14.8 mm" : "10.2 mm"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Nominal: 10.0 mm (±0.5)
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-surface/50 p-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Gauge className="size-3.5 text-warning" />
                        Adhesion Strength
                      </div>
                      <div className="mt-1 text-lg font-mono font-bold text-foreground">
                        {joint.health}%
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Min threshold: 75%
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-surface/50 p-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Zap className="size-3.5 text-secondary-foreground" />
                        Splice Elongation
                      </div>
                      <div className="mt-1 text-lg font-mono font-bold text-foreground">
                        {joint.status === "critical" ? "+4.2 mm" : "+0.6 mm"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Elastic recovery active
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Thermal Heatmap */}
              {activeTab === "thermal" && (
                <div className="space-y-4">
                  <div className="relative h-48 rounded-xl border border-border bg-gradient-to-r from-blue-900 via-amber-700 to-red-900 p-4 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center justify-between text-xs text-white/90">
                      <span className="font-mono flex items-center gap-1">
                        <Flame className="size-3.5 text-amber-300" /> Infrared Thermal Scanner
                      </span>
                      <span className="font-mono bg-black/40 px-2 py-0.5 rounded">
                        Max Temp: {joint.status === "critical" ? "68.4 °C" : "48.2 °C"}
                      </span>
                    </div>

                    <div className="my-auto text-center space-y-2">
                      <div className="inline-block px-4 py-2 rounded-lg bg-black/60 backdrop-blur border border-white/20">
                        <p className="text-xs font-semibold text-white">
                          {joint.status === "critical"
                            ? "Hotspot Detected at Cord Transition 3 (68.4 °C)"
                            : "Thermal gradient uniform across splice"}
                        </p>
                        <p className="text-[11px] text-white/70 mt-0.5">
                          Ambient: 32 °C | Friction Rise: +{joint.status === "critical" ? "36.4" : "16.2"} °C
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/80 font-mono">
                      <span>30°C Cold</span>
                      <div className="h-2 w-32 rounded bg-gradient-to-r from-blue-500 via-amber-400 to-red-600" />
                      <span>75°C Critical</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Acoustic Spectrum */}
              {activeTab === "acoustic" && (
                <div className="space-y-4">
                  <div className="relative h-48 rounded-xl border border-border bg-black/80 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Activity className="size-3.5" /> High-Frequency Acoustic Emission
                      </span>
                      <span>Peak Spectrum: 85 dB @ 2.4 kHz</span>
                    </div>

                    {/* Equalizer bars */}
                    <div className="flex items-end justify-between gap-1.5 h-24 my-auto px-4">
                      {[40, 55, 30, 80, 95, 60, 45, 90, 100, 75, 40, 65, 50, 35].map((val, i) => (
                        <div
                          key={i}
                          className={`w-full rounded-t transition-all ${
                            joint.status === "critical" && i >= 7 && i <= 9
                              ? "bg-critical animate-pulse"
                              : "bg-emerald-500/80"
                          }`}
                          style={{ height: `${joint.status === "critical" ? val : val * 0.5}%` }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>20 Hz</span>
                      <span>1.0 kHz</span>
                      <span>5.0 kHz</span>
                      <span>10 kHz</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 4: RFID Twin */}
              {activeTab === "rfid" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-primary/30 bg-surface/70 p-4 space-y-4">
                    <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Radio className="size-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-mono font-bold text-base text-foreground">
                          RFID Tag: RFID-9042-{joint.id}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Embedded UHF RFID Chip with Non-Volatile Memory
                        </p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Splice Type:</dt>
                        <dd className="font-semibold text-foreground">Vulcanized Steel Cord ST-4500</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Splice Length:</dt>
                        <dd className="font-semibold font-mono text-foreground">2,400 mm</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Manufacturer / Installer:</dt>
                        <dd className="font-semibold text-foreground">ContiTech Field Services</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Installation Date:</dt>
                        <dd className="font-semibold font-mono text-foreground">14 Oct 2025</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Cumulative Belt Cycles:</dt>
                        <dd className="font-semibold font-mono text-foreground">4,821,900 Passes</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Last Inspected:</dt>
                        <dd className="font-semibold text-foreground">{joint.lastInspected}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Inspection Log */}
            <div className="panel p-5 bg-card/60 backdrop-blur flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileCheck2 className="size-4 text-emerald-500" />
                  Joint Maintenance & Work Order
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Directly dispatch a technician task for Joint {joint.id}.
                </p>
              </div>

              <CreateTaskDialog
                conveyorId={conveyor.id}
                jointId={joint.id}
                defaultTitle={`Inspect & Repair Joint ${joint.id}`}
                defaultPriority={joint.status === "critical" ? "critical" : "high"}
                trigger={
                  <Button className="gap-2">
                    <ShieldAlert className="size-4" />
                    Create Task for {joint.id}
                  </Button>
                }
              />
            </div>
          </div>

          {/* Right Column: AI Prediction & Anomaly Diagnosis */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Prediction Card */}
            <PredictionPanel conveyor={conveyor} joint={joint} prediction={prediction} />

            {/* Deep Sensor Telemetry for this Joint */}
            <div className="panel p-5 space-y-4 bg-card/70 backdrop-blur">
              <h3 className="panel-title text-sm flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                Live Sensor Telemetry near {joint.id}
              </h3>

              <div className="space-y-3">
                {conveyor.sensors.slice(0, 4).map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-surface/50 text-xs"
                  >
                    <div>
                      <span className="font-medium text-foreground">{s.label}</span>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Baseline: {s.baseline} {s.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-foreground">
                        {s.value} <span className="text-[10px] text-muted-foreground">{s.unit}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          s.deltaPct > 15 ? "text-critical" : s.deltaPct > 5 ? "text-warning" : "text-healthy"
                        }`}
                      >
                        {s.deltaPct > 0 ? `+${s.deltaPct}%` : `${s.deltaPct}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
