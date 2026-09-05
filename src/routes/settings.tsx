import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { User, Settings as SettingsIcon, Shield, Database, Cpu, Bell } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="System Settings" subtitle="Manage configuration, users and edge devices">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <User className="size-5 text-primary" />
            <h2 className="font-semibold">User Management</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Manage control room operators and field technicians.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Add / Remove Users</li>
              <li>Role-Based Access Control (RBAC)</li>
              <li>Shift Schedule Assignment</li>
            </ul>
            <button className="mt-2 text-primary hover:underline text-xs font-semibold">Configure Users →</button>
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <Shield className="size-5 text-primary" />
            <h2 className="font-semibold">Security & Access</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Configure authentication and network security policies.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Two-Factor Authentication (2FA)</li>
              <li>Active Directory / LDAP Sync</li>
              <li>Audit Logs</li>
            </ul>
            <button className="mt-2 text-primary hover:underline text-xs font-semibold">Security Settings →</button>
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <Cpu className="size-5 text-primary" />
            <h2 className="font-semibold">Edge Devices</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Monitor and configure IoT sensors and local processing nodes.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Sensor Calibration Offsets</li>
              <li>LoRaWAN Network Config</li>
              <li>Firmware OTA Updates</li>
            </ul>
            <button className="mt-2 text-primary hover:underline text-xs font-semibold">Manage Edge Devices →</button>
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <SettingsIcon className="size-5 text-primary" />
            <h2 className="font-semibold">AI Prediction Model</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Adjust machine learning thresholds and anomaly detection sensitivity.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Confidence Thresholds</li>
              <li>Baseline Recalibration</li>
              <li>Model Version: v2.4.1 (Active)</li>
            </ul>
            <button className="mt-2 text-primary hover:underline text-xs font-semibold">Model Parameters →</button>
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <Bell className="size-5 text-primary" />
            <h2 className="font-semibold">Alert Routing</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Define how and when notifications are escalated.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>SMS / Email / Push Notifications</li>
              <li>Escalation Matrices</li>
              <li>Downtime Maintenance Windows</li>
            </ul>
            <button className="mt-2 text-primary hover:underline text-xs font-semibold">Notification Rules →</button>
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <Database className="size-5 text-primary" />
            <h2 className="font-semibold">System Logs</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>View application, server, and diagnostic logs.</p>
            <div className="rounded bg-secondary p-2 text-xs font-mono text-muted-foreground">
              <div>[10:42:01] Edge sync completed.</div>
              <div>[10:35:12] DB backup successful.</div>
              <div>[10:15:00] New alert generated: AL-1041</div>
            </div>
            <button className="mt-2 text-primary hover:underline text-xs font-semibold">View Full Logs →</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
