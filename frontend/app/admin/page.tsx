"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function AdminPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-3">
        {t.admin.cards.map((title) => (
          <Card key={title}>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/60">{t.admin.detail}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
