"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  Bell,
  CalendarDays,
  ChevronsUpDown,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Sparkles,
  UserRound,
  Users
} from "lucide-react";
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
    <div className="min-h-screen bg-[#030303] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-[352px] border-r border-white/10 bg-[#101010] p-5 lg:flex lg:flex-col">
        <Link
          href="/"
          className="flex min-h-[70px] items-center gap-3 rounded-lg border border-red-500 bg-[#171717] px-4 text-lg font-black shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-red-600 text-sm font-black text-white">3S</span>
          {t.shell.brand}
        </Link>

        <label className="mt-4 flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-white/55 transition focus-within:border-white/20 focus-within:text-white">
          <Search size={20} aria-hidden="true" />
          <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-white/45" placeholder="Search..." />
          <span className="rounded border border-white/10 px-2 py-0.5 text-xs text-white/45">⌘ K</span>
        </label>

        <nav className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1">
          <p className="mb-3 px-3 text-sm font-bold text-white/45">{t.shell.operations}</p>
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-semibold text-white/78 transition hover:bg-white/[0.06] hover:text-white",
                  pathname === item.href && "bg-red-950/70 text-white"
                )}
              >
                <item.icon size={20} />
                {t.nav[item.labelKey]}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-5 grid gap-3">
          <button className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
            <Settings size={18} />
            Settings
          </button>
          <LanguageSwitcher />
          <button className="flex min-h-[64px] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-left transition hover:bg-white/[0.08]">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-red-500 to-amber-300 text-sm font-black text-white">SA</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black">Super Admin</span>
              <span className="block truncate text-xs font-semibold text-white/48">superadmin</span>
            </span>
            <ChevronsUpDown size={18} className="text-white/45" />
          </button>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-5 lg:ml-[352px] lg:px-10">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-400">{t.shell.academicYear}</p>
            <h1 className="text-4xl font-black tracking-tight">{t.nav.dashboard}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block lg:hidden"><LanguageSwitcher compact /></div>
            <button className="hidden min-h-12 items-center gap-2 rounded-lg bg-white/[0.08] px-5 text-sm font-bold text-white transition hover:bg-white/[0.12] md:inline-flex">
              <Sparkles size={18} />
              {t.dashboard.monitoring}
            </button>
            <button className="min-h-12 rounded-lg bg-red-600 px-5 text-sm font-black text-white shadow-[0_14px_40px_rgba(220,38,38,0.22)] transition hover:bg-red-500">
              {t.common.live}
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
