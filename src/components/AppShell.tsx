import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Cable,
  Activity,
  Link2,
  BrainCircuit,
  Bell,
  Wrench,
  FileBarChart,
  Settings,
  Mountain,
  CircleUserRound,
  BellRing,
  TriangleAlert,
  ShieldAlert,
  X,
} from "lucide-react";
import { useSystem } from "@/lib/system-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/conveyors", label: "Conveyors", icon: Cable },
  { to: "/live-monitor", label: "Live Monitor", icon: Activity },
  { to: "/belt-joints", label: "Belt Joints", icon: Link2 },
  { to: "/ai-predictions", label: "AI Predictions", icon: BrainCircuit },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const ALERT_REASONS = [
  "Conveyor System CV-04 (Joint J-23): High-magnitude vibration spike of 7.8 mm/s detected. Immediate mechanical inspection required.",
  "Conveyor System CV-07 (Joint J-12): Sustained belt over-tension exceeding safety threshold (82 kN). Critical risk of joint structural failure.",
  "Conveyor System CV-03 (Joint J-08): Lateral belt tracking misalignment of 3.5 mm recorded at main drive pulley.",
  "Conveyor System CV-06 (Joint J-18): Acoustic delamination anomaly detected at 85 dB intensity. Potential splice compromise.",
  "Conveyor System CV-12 (Joint J-31): Elevated idler bearing operating temperature recorded at 68.4 °C.",
];

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { alerts, lastUpdate } = useSystem();
  const open = alerts.filter((a) => !a.acknowledged).length;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [showRedWarning, setShowRedWarning] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);

  // Global 10-second RED WARNING pop-up effect for ALL pages
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setShowRedWarning(true);
    }, 2000);

    const interval = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % ALERT_REASONS.length);
      setShowRedWarning(true);
    }, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="flex flex-col bg-sidebar text-sidebar-foreground lg:h-screen lg:w-60 lg:shrink-0 lg:sticky lg:top-0">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <Mountain className="size-7 text-sidebar-primary-foreground" />
          <div>
            <div className="text-lg leading-none font-bold">NMDC</div>
            <div className="text-[11px] leading-tight text-sidebar-foreground/60">
              Smart Mining
              <br />
              Safer Tomorrow
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-x-auto p-2 max-lg:flex-row">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
                {label === "Alerts" && open > 0 && (
                  <span className="ml-auto rounded-full bg-critical px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {open}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-sidebar-border px-4 py-3 text-[11px] text-sidebar-foreground/60 lg:block">
          <div className="mb-1 flex items-center gap-2 text-sidebar-foreground">
            <span className="size-2 rounded-full bg-healthy" />
            System Online
          </div>
          v1.0.0 · Edge sync {lastUpdate}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 border-b border-border bg-surface px-5 py-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions}
          <Link
            to="/alerts"
            className="relative rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={`${open} unacknowledged alerts`}
          >
            <Bell className="size-5" />
            {open > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-primary-foreground">
                {open}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <CircleUserRound className="size-7 text-muted-foreground" />
            <div className="text-xs leading-tight">
              <div className="font-semibold">Operator</div>
              <div className="text-muted-foreground">Control Room</div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-5">{children}</main>
      </div>

      {/* PROFESSIONAL HIGH-TECH SCADA TELEMETRY ALARM TOAST (LEFT ALIGNED) */}
      {showRedWarning && (
        <div className="fixed bottom-6 left-5 lg:left-68 z-50 animate-in fade-in slide-in-from-left-5 duration-300 w-96 sm:w-[460px]">
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/90 border-l-[8px] border-l-amber-500 bg-slate-950/95 p-4.5 shadow-[0_20px_50px_-10px_rgba(245,158,11,0.45)] backdrop-blur-2xl text-slate-100 font-sans">
            {/* Top Bar: Live Node Sync Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-500/20 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2.5 bg-amber-500" />
                </span>
                <span className="flex items-center gap-1 rounded bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-[11px] font-black tracking-widest text-amber-300 uppercase font-mono">
                  <TriangleAlert className="size-3.5 text-amber-400" />
                  SCADA ALARM
                </span>
                <span className="text-[11px] font-bold text-amber-400/90 font-mono tracking-wider">
                  LEFT NODE TELEMETRY
                </span>
              </div>
              <button
                onClick={() => setShowRedWarning(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                aria-label="Dismiss telemetry alarm"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Main Technological Content */}
            <div className="flex items-start gap-3.5">
              {/* Dual-ring Cyber Sonar Radar Icon */}
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-400 shadow-inner mt-0.5">
                <span className="absolute inline-flex size-full rounded-xl bg-amber-400 opacity-20 animate-ping" />
                <BellRing className="relative size-6 text-amber-400 animate-bounce" />
              </div>

              {/* Text & Sensor Diagnostics */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-100 leading-snug">
                  {ALERT_REASONS[alertIndex]}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400/80">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    NODE: EDGE-AI-LEFT-01 • LATENCY &lt; 5ms
                  </div>
                  <button
                    onClick={() => setShowRedWarning(false)}
                    className="rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs px-4 py-1.5 shadow-md shadow-amber-500/30 transition-all font-mono tracking-wider hover:scale-105 active:scale-95"
                  >
                    ACKNOWLEDGE SIGNAL
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Animated Laser Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 animate-[shrink_10s_linear_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







