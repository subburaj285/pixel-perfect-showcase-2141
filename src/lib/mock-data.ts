export type Status = "healthy" | "warning" | "high" | "critical";
export type Severity = "critical" | "high" | "warning" | "info";

export type SensorKey =
  | "vibration"
  | "temperature"
  | "speed"
  | "tension"
  | "alignment"
  | "acoustic";

export type SensorReading = {
  key: SensorKey;
  label: string;
  value: number;
  unit: string;
  status: "Normal" | "Warning" | "High" | "Abnormal";
  deltaPct: number;
  baseline: number;
  decimals: number;
};

export type Joint = {
  id: string;
  conveyorId: string;
  positionM: number;
  health: number;
  status: Status;
  condition: string;
  lastInspected: string;
};

export type Prediction = {
  conveyorId: string;
  jointId: string;
  failureType: string;
  probability: number;
  windowLabel: string;
  severity: Severity;
  mainCause: string;
  recommendation: string;
  factors: string[];
  history: { day: string; risk: number }[];
};

export type Conveyor = {
  id: string;
  name: string;
  route: string;
  plant: string;
  status: Status;
  health: number;
  load: number;
  speed: number;
  lengthKm: number;
  activeAlert: string | null;
  updated: string;
  joints: Joint[];
  sensors: SensorReading[];
};

export type Alert = {
  id: string;
  time: string;
  conveyorId: string;
  jointId: string;
  issue: string;
  severity: Severity;
  detail: string;
  acknowledged: boolean;
};

export type TaskStatus = "critical" | "due-today" | "upcoming" | "in-progress" | "completed" | "overdue";

export type MaintenanceTask = {
  id: string;
  conveyorId: string;
  jointId: string;
  title: string;
  priority: Severity;
  due: string;
  status: TaskStatus;
  technician: string;
  notes: string[];
};

// Deterministic pseudo-random so SSR and client agree.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const STATUS_PLAN: Status[] = (() => {
  const plan: Status[] = Array(24).fill("healthy");
  plan[3] = "critical"; // CV-04
  plan[6] = "high"; // CV-07
  plan[2] = "warning"; // CV-03
  plan[5] = "warning"; // CV-06
  plan[11] = "warning"; // CV-12
  plan[17] = "warning"; // CV-18
  return plan;
})();

const NAMES = [
  ["Primary Feed", "Mine Face → Primary Feed"],
  ["Screening Line", "Primary Feed → Screening"],
  ["Crusher Infeed", "Screening → Crusher"],
  ["Primary Crusher to Stockpile", "Primary Crusher → Stockpile"],
  ["Stockpile Reclaim", "Stockpile → Reclaim Tunnel"],
  ["Secondary Transfer", "Reclaim → Secondary Screen"],
  ["Fines Conveyor", "Secondary Screen → Fines Bin"],
  ["Lump Ore Line", "Secondary Screen → Lump Bin"],
  ["Overland Section A", "Plant → Overland A"],
  ["Overland Section B", "Overland A → Overland B"],
  ["Yard Feeder", "Overland B → Yard"],
  ["Wagon Loadout", "Yard → Rail Loadout"],
  ["Waste Rock Line", "Pit → Waste Dump"],
  ["Sizer Discharge", "Sizer → Surge Bin"],
  ["Surge Bin Reclaim", "Surge Bin → Wash Plant"],
  ["Wash Plant Feed", "Wash Plant Feed"],
  ["Slurry Dewater Belt", "Dewater → Product Pile"],
  ["Product Stacker", "Product Pile → Stacker"],
  ["Pellet Plant Feed", "Stacker → Pellet Plant"],
  ["Return Belt 1", "Pellet Plant → Return"],
  ["Return Belt 2", "Return → Storage"],
  ["Shiploader Feed", "Storage → Shiploader"],
  ["Sampling Line", "Loadout → Sampling Tower"],
  ["Emergency Bypass", "Bypass → Surge Bin"],
];

const HEALTH_BY_STATUS: Record<Status, [number, number]> = {
  healthy: [88, 98],
  warning: [64, 78],
  high: [50, 60],
  critical: [40, 46],
};

function sensorsFor(status: Status, rnd: () => number): SensorReading[] {
  const crit = status === "critical";
  const high = status === "high";
  const warn = status === "warning";
  const bump = crit ? 1 : high ? 0.7 : warn ? 0.35 : 0;

  const vibration = 3.2 + bump * 4.6 + rnd() * 0.4;
  const temperature = 48 + bump * 13 + rnd() * 3;
  const speed = 4.0 + rnd() * 0.4;
  const tension = 62 + bump * 20 + rnd() * 3;
  const alignment = 1.1 + bump * 2.4 + rnd() * 0.3;
  const acoustic = 68 + bump * 17 + rnd() * 3;

  const mk = (
    key: SensorKey,
    label: string,
    value: number,
    unit: string,
    baseline: number,
    decimals: number,
    thresholds: [number, number],
    abnormalLabel: "High" | "Abnormal" | "Warning" = "High",
  ): SensorReading => {
    const st: SensorReading["status"] =
      value >= thresholds[1] ? abnormalLabel : value >= thresholds[0] ? "Warning" : "Normal";
    return {
      key,
      label,
      value,
      unit,
      baseline,
      decimals,
      status: st,
      deltaPct: Math.round(((value - baseline) / baseline) * 100),
    };
  };

  return [
    mk("vibration", "Vibration", vibration, "mm/s", 6.3, 1, [5.5, 6.8]),
    mk("temperature", "Temperature", temperature, "°C", 58, 0, [66, 74]),
    mk("speed", "Belt Speed", speed, "m/s", 4.15, 1, [4.8, 5.2]),
    mk("tension", "Tension", tension, "kN", 71, 0, [76, 80]),
    mk("alignment", "Alignment", alignment, "mm", 3.2, 1, [2.6, 4.2], "Warning"),
    mk("acoustic", "Acoustic", acoustic, "dB", 71, 0, [78, 83], "Abnormal"),
  ];
}

function jointsFor(id: string, index: number, status: Status, rnd: () => number): Joint[] {
  const count = 5 + Math.floor(rnd() * 3);
  const startNo = 20 + index;
  const joints: Joint[] = [];
  for (let i = 0; i < count; i++) {
    let jStatus: Status = "healthy";
    let health = 86 + Math.floor(rnd() * 12);
    if (status !== "healthy" && i === 2) {
      jStatus = status;
      health = HEALTH_BY_STATUS[status][0] + Math.floor(rnd() * 4);
    } else if (status !== "healthy" && i === 3) {
      jStatus = "warning";
      health = 68 + Math.floor(rnd() * 8);
    }
    joints.push({
      id: `J-${startNo + i}`,
      conveyorId: id,
      positionM: Math.round((420 + i * 474 + rnd() * 40) / 2) * 2,
      health,
      status: jStatus,
      condition:
        jStatus === "critical"
          ? "Possible splice degradation"
          : jStatus === "high"
            ? "Elevated tension at splice"
            : jStatus === "warning"
              ? "Minor edge wear detected"
              : "Splice within tolerance",
      lastInspected: `${4 + i} days ago`,
    });
  }
  return joints;
}

export const conveyors: Conveyor[] = STATUS_PLAN.map((status, i) => {
  const rnd = seeded(1000 + i * 37);
  const id = `CV-${String(i + 1).padStart(2, "0")}`;
  const [lo, hi] = HEALTH_BY_STATUS[status];
  const joints = jointsFor(id, i, status, rnd);
  const flagged = joints.find((j) => j.status === status && status !== "healthy");
  return {
    id,
    name: NAMES[i][0],
    route: NAMES[i][1],
    plant: i < 12 ? "Plant 1" : i < 20 ? "Plant 2" : "Loadout Yard",
    status,
    health: lo + Math.floor(rnd() * (hi - lo)),
    load: 55 + Math.floor(rnd() * 40),
    speed: Number((3.8 + rnd() * 0.7).toFixed(1)),
    lengthKm: Number((1.2 + rnd() * 2.4).toFixed(1)),
    activeAlert: flagged ? `Joint ${flagged.id}` : null,
    updated: `${1 + Math.floor(rnd() * 9)} min ago`,
    joints,
    sensors: sensorsFor(status, rnd),
  };
});

// Hero conveyor CV-04 pinned to the spec numbers.
const cv04 = conveyors[3];
cv04.lengthKm = 2.4;
cv04.load = 91;
cv04.speed = 4.2;
cv04.health = 42;
cv04.joints = [
  { id: "J-21", conveyorId: "CV-04", positionM: 412, health: 93, status: "healthy", condition: "Splice within tolerance", lastInspected: "6 days ago" },
  { id: "J-22", conveyorId: "CV-04", positionM: 1124, health: 89, status: "healthy", condition: "Splice within tolerance", lastInspected: "6 days ago" },
  { id: "J-23", conveyorId: "CV-04", positionM: 1842, health: 42, status: "critical", condition: "Possible splice degradation", lastInspected: "21 days ago" },
  { id: "J-24", conveyorId: "CV-04", positionM: 2108, health: 71, status: "warning", condition: "Minor edge wear detected", lastInspected: "12 days ago" },
  { id: "J-25", conveyorId: "CV-04", positionM: 2360, health: 95, status: "healthy", condition: "Splice within tolerance", lastInspected: "4 days ago" },
];
cv04.activeAlert = "Joint J-23";
cv04.sensors = [
  { key: "vibration", label: "Vibration", value: 7.8, unit: "mm/s", status: "High", deltaPct: 23, baseline: 6.3, decimals: 1 },
  { key: "temperature", label: "Temperature", value: 61, unit: "°C", status: "Normal", deltaPct: 2, baseline: 59.8, decimals: 0 },
  { key: "speed", label: "Belt Speed", value: 4.2, unit: "m/s", status: "Normal", deltaPct: 1, baseline: 4.16, decimals: 1 },
  { key: "tension", label: "Tension", value: 82, unit: "kN", status: "High", deltaPct: 15, baseline: 71, decimals: 0 },
  { key: "alignment", label: "Alignment", value: 3.5, unit: "mm", status: "Warning", deltaPct: 8, baseline: 3.24, decimals: 1 },
  { key: "acoustic", label: "Acoustic", value: 85, unit: "dB", status: "Abnormal", deltaPct: 20, baseline: 70.8, decimals: 0 },
];

const riskHistory = (peak: number) =>
  [6, 5, 4, 3, 2, 1, 0].map((d, i) => ({
    day: `D-${6 - i}`,
    risk: Math.max(8, Math.round(peak - d * (peak / 9) - (d % 2) * 4)),
  }));

export const predictions: Prediction[] = [
  {
    conveyorId: "CV-04",
    jointId: "J-23",
    failureType: "Belt Joint Rupture",
    probability: 87,
    windowLabel: "18 – 24 hours",
    severity: "critical",
    mainCause: "High vibration + tension at splice",
    recommendation: "Inspect splice at J-23 and re-tension belt",
    factors: [
      "Vibration is 23% above baseline",
      "Tension is 15% above normal",
      "Acoustic signature abnormal (85 dB)",
      "Alignment deviation of 3.5 mm detected",
      "Pattern matched 7 previous joint-rupture events",
    ],
    history: riskHistory(87),
  },
  {
    conveyorId: "CV-07",
    jointId: "J-12",
    failureType: "Splice Elongation",
    probability: 64,
    windowLabel: "3 – 5 days",
    severity: "high",
    mainCause: "Sustained high tension",
    recommendation: "Schedule tension survey and splice check",
    factors: [
      "Tension 12% above normal for 36 hours",
      "Gradual health-score decline over 9 days",
      "Load consistently above 85%",
    ],
    history: riskHistory(64),
  },
  {
    conveyorId: "CV-03",
    jointId: "J-08",
    failureType: "Belt Mistracking",
    probability: 41,
    windowLabel: "7 – 10 days",
    severity: "warning",
    mainCause: "Progressive alignment drift",
    recommendation: "Adjust training idlers at 640 m",
    factors: ["Alignment drift 2.8 mm", "Edge wear trend rising", "Idler temperature slightly elevated"],
    history: riskHistory(41),
  },
  {
    conveyorId: "CV-12",
    jointId: "J-31",
    failureType: "Idler Bearing Failure",
    probability: 38,
    windowLabel: "8 – 12 days",
    severity: "warning",
    mainCause: "Rising bearing temperature",
    recommendation: "Replace idler set, lubricate bearings",
    factors: ["Temperature rising 0.4 °C/day", "Low-frequency vibration harmonic present"],
    history: riskHistory(38),
  },
  {
    conveyorId: "CV-06",
    jointId: "J-18",
    failureType: "Splice Delamination",
    probability: 52,
    windowLabel: "4 – 6 days",
    severity: "high",
    mainCause: "Abnormal acoustic pattern",
    recommendation: "Ultrasonic inspection of splice J-18",
    factors: ["Acoustic 14% above baseline", "Intermittent vibration spikes"],
    history: riskHistory(52),
  },
];

export const initialAlerts: Alert[] = [
  { id: "AL-1042", time: "10:28 AM", conveyorId: "CV-04", jointId: "J-23", issue: "High Vibration", severity: "critical", detail: "7.8 mm/s sustained for 42 min at 1,842 m", acknowledged: false },
  { id: "AL-1041", time: "10:15 AM", conveyorId: "CV-07", jointId: "J-12", issue: "High Tension", severity: "high", detail: "Tension 79 kN, 12% above operating band", acknowledged: false },
  { id: "AL-1040", time: "09:58 AM", conveyorId: "CV-03", jointId: "J-08", issue: "Misalignment", severity: "warning", detail: "Belt drift 2.8 mm toward drive side", acknowledged: false },
  { id: "AL-1039", time: "09:42 AM", conveyorId: "CV-12", jointId: "J-31", issue: "Temperature Rising", severity: "warning", detail: "Idler bearing at 68 °C and climbing", acknowledged: false },
  { id: "AL-1038", time: "09:20 AM", conveyorId: "CV-06", jointId: "J-18", issue: "Acoustic Abnormal", severity: "high", detail: "Broadband noise 81 dB near splice", acknowledged: false },
  { id: "AL-1037", time: "08:54 AM", conveyorId: "CV-18", jointId: "J-37", issue: "Load Surge", severity: "warning", detail: "Load spike to 96% for 4 min", acknowledged: true },
  { id: "AL-1036", time: "08:11 AM", conveyorId: "CV-09", jointId: "J-28", issue: "Sensor Offline", severity: "info", detail: "Vibration node VN-214 lost LoRa uplink", acknowledged: true },
  { id: "AL-1035", time: "07:35 AM", conveyorId: "CV-04", jointId: "J-24", issue: "Edge Wear", severity: "warning", detail: "Vision system flagged edge fraying", acknowledged: true },
];

export const initialTasks: MaintenanceTask[] = [
  { id: "MT-501", conveyorId: "CV-04", jointId: "J-23", title: "Inspect belt joint splice", priority: "critical", due: "Within 24 hours", status: "critical", technician: "R. Meena", notes: ["Auto-created from AI prediction (87%)"] },
  { id: "MT-502", conveyorId: "CV-04", jointId: "J-24", title: "Belt tension and alignment check", priority: "high", due: "Today, 18:00", status: "due-today", technician: "S. Kumar", notes: [] },
  { id: "MT-503", conveyorId: "CV-07", jointId: "J-12", title: "Tension survey after splice alarm", priority: "high", due: "Today, 20:00", status: "due-today", technician: "A. Patil", notes: [] },
  { id: "MT-504", conveyorId: "CV-03", jointId: "J-08", title: "Adjust training idlers", priority: "warning", due: "Tomorrow", status: "upcoming", technician: "Unassigned", notes: [] },
  { id: "MT-505", conveyorId: "CV-12", jointId: "J-31", title: "Replace idler bearing set", priority: "warning", due: "In 3 days", status: "upcoming", technician: "Unassigned", notes: [] },
  { id: "MT-506", conveyorId: "CV-06", jointId: "J-18", title: "Ultrasonic splice inspection", priority: "high", due: "In progress", status: "in-progress", technician: "D. Rao", notes: ["Scaffold in place at 980 m"] },
  { id: "MT-507", conveyorId: "CV-15", jointId: "J-34", title: "Scraper blade replacement", priority: "info", due: "Overdue by 2 days", status: "overdue", technician: "M. Singh", notes: [] },
  { id: "MT-508", conveyorId: "CV-01", jointId: "J-20", title: "Quarterly splice audit", priority: "info", due: "Completed 28 Apr", status: "completed", technician: "R. Meena", notes: [] },
];

export const systemStatus = {
  sensorsOnline: 186,
  sensorsOffline: 2,
  edgeDevices: 24,
  dataQuality: 98.6,
  network: "LoRa – Stable",
  lastData: "10:30:40 AM",
};

export const statusMeta: Record<Status, { label: string; token: string }> = {
  healthy: { label: "Healthy", token: "healthy" },
  warning: { label: "Warning", token: "warning" },
  high: { label: "High Risk", token: "risk" },
  critical: { label: "Critical", token: "critical" },
};

export function getConveyor(id: string) {
  return conveyors.find((c) => c.id === id) ?? conveyors[3];
}

export function getPrediction(conveyorId: string) {
  return predictions.find((p) => p.conveyorId === conveyorId) ?? null;
}
