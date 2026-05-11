"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { Bell, CalendarDays, GraduationCap, LayoutDashboard, MessageSquare, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

const navItems: ReadonlyArray<{ href: Route; labelKey: keyof ReturnType<typeof useTranslation>["t"]["nav"]; icon: typeof LayoutDashboard }> = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/superadmin", labelKey: "superAdmin", icon: Shield },
  { href: "/admin", labelKey: "admin", icon: Users },
  { href: "/teacher", labelKey: "teacher", icon: GraduationCap },
  { href: "/parent", labelKey: "parent", icon: Bell },
  { href: "/timetable", labelKey: "timetable", icon: CalendarDays },
  { href: "/messaging", labelKey: "messages", icon: MessageSquare }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#f7f3ea] text-ink dark:bg-[#101010] dark:text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/50 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 font-black">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-amber-300 text-black">3S</span>
          {t.shell.brand}
        </Link>
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 font-semibold text-black/64 transition hover:bg-amber-100 dark:text-white/64 dark:hover:bg-white/10",
                pathname === item.href && "bg-black text-white dark:bg-amber-300 dark:text-black"
              )}
            >
              <item.icon size={18} />
              {t.nav[item.labelKey]}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <LanguageSwitcher />
        </div>
      </aside>
      <main className="min-w-0 px-4 py-5 lg:ml-72 lg:px-8">
        <header className="mb-6 flex items-center justify-between rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">{t.shell.academicYear}</p>
            <h1 className="text-2xl font-black">{t.shell.operations}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block lg:hidden"><LanguageSwitcher compact /></div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-200">{t.common.live}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
