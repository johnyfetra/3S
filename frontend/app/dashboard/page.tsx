"use client";

import { Activity, AlertTriangle, GraduationCap, Users } from "lucide-react";
import { AppShell } from "@/components/layouts/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonitoringGrid } from "@/components/dashboard/monitoring-grid";
import { AcademicChart } from "@/components/charts/academic-chart";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label={t.dashboard.activeUsers} value="284" detail={t.dashboard.activeUsersDetail} icon={<Users size={22} />} />
        <StatCard label={t.dashboard.onlineTeachers} value="38" detail={t.dashboard.onlineTeachersDetail} icon={<GraduationCap size={22} />} />
        <StatCard label={t.dashboard.recentLogins} value="96" detail={t.dashboard.recentLoginsDetail} icon={<Activity size={22} />} />
        <StatCard label={t.dashboard.alerts} value="7" detail={t.dashboard.alertsDetail} icon={<AlertTriangle size={22} />} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-black text-black dark:text-white">{t.dashboard.performance}</h2>
          <AcademicChart />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black text-black dark:text-white">{t.dashboard.monitoring}</h2>
          <MonitoringGrid />
        </Card>
      </div>
    </AppShell>
  );
}
