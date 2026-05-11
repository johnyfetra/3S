import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-black/58 dark:text-white/58">{label}</p>
          <strong className="mt-2 block text-3xl font-black">{value}</strong>
          <p className="mt-2 text-sm text-black/56 dark:text-white/56">{detail}</p>
        </div>
        <div className="rounded-lg bg-amber-100 p-3 text-amber-700 dark:bg-white/[0.06] dark:text-white/55">{icon}</div>
      </div>
    </Card>
  );
}
