import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";

export default function ParentPage() {
  return (
    <AppShell>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Student selector</p>
            <h2 className="text-2xl font-black">Miora Rakoto - Middle School - Grade 8</h2>
          </div>
          <select className="min-h-11 rounded-lg border border-black/10 px-3 dark:border-white/10 dark:bg-black">
            <option>Miora Rakoto - Middle School - Grade 8</option>
            <option>Andry Rakoto - Primary - Grade 4</option>
          </select>
        </div>
      </Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {["Report cards", "Attendance", "Teacher comments", "Messaging", "Announcements", "Academic averages"].map((title) => (
          <Card key={title}><h3 className="text-xl font-black">{title}</h3></Card>
        ))}
      </div>
    </AppShell>
  );
}

