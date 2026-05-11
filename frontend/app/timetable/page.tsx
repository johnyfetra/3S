import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";

export default function TimetablePage() {
  return (
    <AppShell>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">Smart timetable engine</h2>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">Available teachers Monday 10:00-11:00</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">No conflicts</span>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="min-h-20 rounded-lg border border-black/10 bg-amber-50 p-2 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
              {index % 6 === 0 ? "Math - Room 204" : index % 7 === 0 ? "Available" : ""}
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

