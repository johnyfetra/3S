import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-3">
        {["Announcements", "Report card approval", "Teacher locations", "Suspicious logins", "Class averages", "Student image uploads"].map((title) => (
          <Card key={title}>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/60">Administrative workflow queue with audit trails, RBAC protection, and realtime status.</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

