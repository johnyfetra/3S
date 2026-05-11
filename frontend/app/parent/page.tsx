"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function ParentPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">{t.parent.selector}</p>
            <h2 className="text-2xl font-black">{t.parent.childOne}</h2>
          </div>
          <select className="min-h-11 rounded-lg border border-white/10 bg-black px-3 text-white">
            <option>{t.parent.childOne}</option>
            <option>{t.parent.childTwo}</option>
          </select>
        </div>
      </Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {t.parent.cards.map((title) => (
          <Card key={title}><h3 className="text-xl font-black">{title}</h3></Card>
        ))}
      </div>
    </AppShell>
  );
}
