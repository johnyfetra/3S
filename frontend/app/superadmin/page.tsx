"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { MonitoringGrid } from "@/components/dashboard/monitoring-grid";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function SuperAdminPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <h2 className="text-lg font-semibold tracking-tight">{t.superAdmin.controls}</h2>
          <div className="mt-5 grid gap-3">
            {t.superAdmin.items.map((item) => (
              <button key={item} className="min-h-12 rounded-lg border border-black/10 bg-black/[0.03] px-4 text-left font-semibold text-black/75 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80 dark:hover:bg-white/[0.07]">{item}</button>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">{t.superAdmin.sessions}</h2>
          <MonitoringGrid />
        </Card>
      </div>
    </AppShell>
  );
}
