import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";

export default function TeacherPage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-xl font-black">Preparation cards</h2>
          <div className="mt-5 grid gap-3">
            {["Lesson title", "Objectives", "Planned activities", "Planned tests", "Bimester progression"].map((field) => (
              <div key={field} className="rounded-lg border border-black/10 p-3 dark:border-white/10">{field}</div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Logbook and AI validation</h2>
          <p className="mt-3 text-black/60 dark:text-white/60">The validation engine compares planned lessons with actual teaching records and flags missing, delayed, or inconsistent entries.</p>
          <div className="mt-5 rounded-lg bg-amber-50 p-4 font-semibold text-amber-900 dark:bg-amber-300/15 dark:text-amber-200">3 delayed lessons detected for Bimester 2</div>
        </Card>
      </div>
    </AppShell>
  );
}

