import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  conveyors as baseConveyors,
  initialAlerts,
  initialTasks,
  type Alert,
  type Conveyor,
  type MaintenanceTask,
  type SensorReading,
  type Status,
  type TaskStatus,
} from "./mock-data";

type TrendPoint = { t: string; vibration: number; temperature: number; tension: number; acoustic: number };

type SystemContextValue = {
  conveyors: Conveyor[];
  selectedConveyorId: string;
  selectedJointId: string;
  selectConveyor: (id: string, jointId?: string) => void;
  selectJoint: (id: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (s: Status | "all") => void;
  live: Record<string, SensorReading[]>;
  trend: TrendPoint[];
  alerts: Alert[];
  acknowledge: (id: string) => void;
  tasks: MaintenanceTask[];
  addTask: (task: Omit<MaintenanceTask, "id">) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  assignTechnician: (id: string, tech: string) => void;
  addNote: (id: string, note: string) => void;
  lastUpdate: string;
};

const SystemContext = createContext<SystemContextValue | null>(null);

function jitter(sensors: SensorReading[], factor: number): SensorReading[] {
  return sensors.map((s, i) => {
    const wobble = Math.sin(factor + i * 1.7) * (s.baseline * 0.012);
    const value = Math.max(0, s.value + wobble * 0.6);
    return {
      ...s,
      value: Number(value.toFixed(s.decimals)),
      deltaPct: Math.round(((value - s.baseline) / s.baseline) * 100),
    };
  });
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [selectedConveyorId, setSelectedConveyorId] = useState("CV-04");
  const [selectedJointId, setSelectedJointId] = useState("J-23");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initialTasks);
  const [tick, setTick] = useState(0);
  const [lastUpdate, setLastUpdate] = useState("—");
  const [trend, setTrend] = useState<TrendPoint[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const live = useMemo(() => {
    const map: Record<string, SensorReading[]> = {};
    for (const c of baseConveyors) map[c.id] = tick === 0 ? c.sensors : jitter(c.sensors, tick + c.id.charCodeAt(3));
    return map;
  }, [tick]);

  useEffect(() => {
    const s = live[selectedConveyorId] ?? [];
    const get = (k: string) => s.find((x) => x.key === k)?.value ?? 0;
    setLastUpdate(new Date().toLocaleTimeString());
    setTrend((prev) =>
      [
        ...prev,
        {
          t: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
          vibration: get("vibration"),
          temperature: get("temperature"),
          tension: get("tension"),
          acoustic: get("acoustic"),
        },
      ].slice(-24),
    );
  }, [tick, selectedConveyorId, live]);

  useEffect(() => {
    setTrend([]);
  }, [selectedConveyorId]);

  const selectConveyor = useCallback((id: string, jointId?: string) => {
    setSelectedConveyorId(id);
    const conveyor = baseConveyors.find((c) => c.id === id);
    setSelectedJointId(
      jointId ??
        conveyor?.joints.find((j) => j.status === "critical")?.id ??
        conveyor?.joints.find((j) => j.status !== "healthy")?.id ??
        conveyor?.joints[0].id ??
        "",
    );
  }, []);

  const value: SystemContextValue = {
    conveyors: baseConveyors,
    selectedConveyorId,
    selectedJointId,
    selectConveyor,
    selectJoint: setSelectedJointId,
    statusFilter,
    setStatusFilter,
    live,
    trend,
    alerts,
    acknowledge: (id) => setAlerts((a) => a.map((x) => (x.id === id ? { ...x, acknowledged: true } : x))),
    tasks,
    addTask: (task) => setTasks((t) => [{ ...task, id: `MT-${520 + t.length}` }, ...t]),
    setTaskStatus: (id, status) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status } : x))),
    assignTechnician: (id, tech) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, technician: tech } : x))),
    addNote: (id, note) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, notes: [...x.notes, note] } : x))),
    lastUpdate,
  };

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used inside SystemProvider");
  return ctx;
}
