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
            <h2 className="text-xl font-black">{t.timetable.title}</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{t.timetable.available}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">{t.timetable.noConflicts}</span>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="min-h-20 rounded-lg border border-black/10 bg-amber-50 p-2 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
              {index % 6 === 0 ? t.timetable.mathRoom : index % 7 === 0 ? t.timetable.free : ""}
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
