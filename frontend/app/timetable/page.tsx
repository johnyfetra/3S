"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function TimetablePage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t.timetable.title}</h2>
            <p className="mt-1 text-sm text-black/55 dark:text-white/55">{t.timetable.available}</p>
          </div>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-200">{t.timetable.noConflicts}</span>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="min-h-20 rounded-lg border border-black/10 bg-black/[0.03] p-2 text-xs font-semibold text-black/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80">
              {index % 6 === 0 ? t.timetable.mathRoom : index % 7 === 0 ? t.timetable.free : ""}
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
