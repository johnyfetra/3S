import { Activity, AlertTriangle, GraduationCap, Users } from "lucide-react";
import { AppShell } from "@/components/layouts/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonitoringGrid } from "@/components/dashboard/monitoring-grid";
import { AcademicChart } from "@/components/charts/academic-chart";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active users" value="284" detail="Teachers, parents, and admins" icon={<Users size={22} />} />
        <StatCard label="Online teachers" value="38" detail="12 currently teaching" icon={<GraduationCap size={22} />} />
        <StatCard label="Recent logins" value="96" detail="Last 24 hours" icon={<Activity size={22} />} />
        <StatCard label="Alerts" value="7" detail="3 need admin review" icon={<AlertTriangle size={22} />} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-black">Academic performance and program completion</h2>
          <AcademicChart />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black">Realtime monitoring</h2>
          <MonitoringGrid />
        </Card>
      </div>
    </AppShell>
  );
}

