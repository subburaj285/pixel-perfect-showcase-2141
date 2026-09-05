import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

const downtimeData = [
  { month: "Jan", planned: 120, unplanned: 45 },
  { month: "Feb", planned: 110, unplanned: 60 },
  { month: "Mar", planned: 130, unplanned: 35 },
  { month: "Apr", planned: 90, unplanned: 25 },
  { month: "May", planned: 140, unplanned: 15 },
  { month: "Jun", planned: 105, unplanned: 20 },
];

const healthData = [
  { status: "Healthy", count: 18, fill: "var(--healthy)" },
  { status: "Warning", count: 4, fill: "var(--warning)" },
  { status: "High Risk", count: 1, fill: "var(--risk)" },
  { status: "Critical", count: 1, fill: "var(--critical)" },
];

function ReportsPage() {
  return (
    <AppShell title="Reports & Analytics" subtitle="System-wide performance, health and maintenance reports">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <h2 className="panel-title mb-4">Downtime Analysis (Hours)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtimeData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: 6 }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="planned" name="Planned Maintenance" stackId="a" fill="var(--info)" />
                <Bar dataKey="unplanned" name="Unplanned Downtime" stackId="a" fill="var(--critical)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <h2 className="panel-title mb-4">Current Fleet Health</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="status" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: 6 }}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {healthData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-full panel p-4">
          <h2 className="panel-title mb-4">Available Reports</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Conveyor Health Report",
              "Joint Condition Summary",
              "AI Failure Prediction Accuracy",
              "Maintenance Task History",
              "Downtime & Production Loss",
              "Sensor Calibration Log"
            ].map((report) => (
              <div key={report} className="rounded border border-border bg-secondary/50 p-4 hover:bg-secondary cursor-pointer transition-colors">
                <div className="font-medium text-sm text-foreground">{report}</div>
                <div className="mt-2 text-xs text-muted-foreground">PDF / CSV export available</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
