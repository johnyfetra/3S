import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { MonitoringGrid } from "@/components/dashboard/monitoring-grid";

export default function SuperAdminPage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <h2 className="text-xl font-black">Platform controls</h2>
          <div className="mt-5 grid gap-3">
            {["Create users", "Block accounts", "Reset passwords", "Configure security", "Audit activity"].map((item) => (
              <button key={item} className="min-h-12 rounded-lg border border-black/10 px-4 text-left font-semibold transition hover:bg-amber-50 dark:border-white/10 dark:hover:bg-white/10">{item}</button>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black">Online users and sessions</h2>
          <MonitoringGrid />
        </Card>
      </div>
    </AppShell>
  );
}

