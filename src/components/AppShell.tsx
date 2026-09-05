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
  Siren,
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

  // Global 10-second RED WARNING pop-up effect for ALL pages
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setShowRedWarning(true);
    }, 2000);

    const interval = setInterval(() => {
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

      {/* GLOBAL RIGHT CORNER RED WARNING POP-UP (ON ALL PAGES EVERY 10 SECONDS) */}
      {showRedWarning && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="relative w-80 rounded-2xl border-4 border-red-600 bg-stone-950 p-6 text-center text-white shadow-[0_0_50px_rgba(239,68,68,0.85)] space-y-4">
            <button
              onClick={() => setShowRedWarning(false)}
              className="absolute top-3 right-3 rounded-full p-1.5 text-stone-400 hover:bg-red-950 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="flex justify-center">
              <div className="relative flex size-14 items-center justify-center rounded-xl bg-red-600/20 border-2 border-red-500 text-red-500 animate-pulse">
                <Siren className="size-8 text-red-500 animate-bounce" />
                <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 animate-ping" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-extrabold text-2xl text-red-500 tracking-wider uppercase animate-pulse">
                WARNING
              </h2>
              <p className="text-[10px] text-red-400 font-mono font-semibold uppercase tracking-widest">
                CRITICAL SYSTEM ALERT
              </p>
            </div>

            <Button
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 text-xs rounded-xl shadow-lg shadow-red-950"
              onClick={() => setShowRedWarning(false)}
            >
              OK / DISMISS
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


