"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function TeacherPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-xl font-black">{t.teacher.preparationCards}</h2>
          <div className="mt-5 grid gap-3">
            {t.teacher.fields.map((field) => (
              <div key={field} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white/80">{field}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">{t.teacher.validation}</h2>
          <p className="mt-3 text-white/55">{t.teacher.validationText}</p>
          <div className="mt-5 rounded-lg bg-amber-300/15 p-4 font-semibold text-amber-200">{t.teacher.warning}</div>
        </Card>
      </div>
    </AppShell>
  );
}
