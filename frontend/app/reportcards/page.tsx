"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function ReportCardsPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <Card>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">{t.reportCards.title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-black/65 dark:border-white/10 dark:text-white/70">
                {t.reportCards.headings.map((heading) => (
                  <th key={heading} className="p-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.reportCards.subjects.map((subject, index) => (
                <tr key={subject} className="border-b border-black/10 text-black/75 dark:border-white/10 dark:text-white/80">
                  <td className="p-3 font-semibold">{subject}</td>
                  <td className="p-3">{14 + (index % 4)}</td>
                  <td className="p-3">{13 + (index % 5)}</td>
                  <td className="p-3">{14.2 + index / 10}</td>
                  <td className="p-3">{index < 3 ? 4 : 2}</td>
                  <td className="p-3">{42 + index}</td>
                  <td className="p-3">B+</td>
                  <td className="p-3">{t.reportCards.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
