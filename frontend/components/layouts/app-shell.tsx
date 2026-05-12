"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Users
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/types/domain";

const navItems: ReadonlyArray<{
  href: Route;
  labelKey: keyof ReturnType<typeof useTranslation>["t"]["nav"];
  icon: typeof LayoutDashboard;
  roles: Role[];
}> = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard, roles: ["super_admin", "admin", "teacher", "parent"] },
  { href: "/superadmin", labelKey: "superAdmin", icon: Shield, roles: ["super_admin"] },
  { href: "/admin", labelKey: "admin", icon: Users, roles: ["super_admin", "admin"] },
  { href: "/teacher", labelKey: "teacher", icon: GraduationCap, roles: ["super_admin", "admin", "teacher"] },
  { href: "/parent", labelKey: "parent", icon: Bell, roles: ["super_admin", "admin", "parent"] },
  { href: "/timetable", labelKey: "timetable", icon: CalendarDays, roles: ["super_admin", "admin", "teacher"] },
  { href: "/messaging", labelKey: "messages", icon: MessageSquare, roles: ["super_admin", "admin", "teacher", "parent"] }
];

const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Administration",
  teacher: "Enseignant",
  parent: "Parent"
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const username = useAuthStore((state) => state.username);
  const role = useAuthStore((state) => state.role);
  const fullName = useAuthStore((state) => state.fullName);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const syncSession = useAuthStore((state) => state.syncSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));
  const initials = (fullName || username || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    void syncSession();
  }, [accessToken, syncSession]);

  function logout() {
    clearSession();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#111111] dark:bg-[#030303] dark:text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-[352px] border-r border-black/10 bg-[#fbf7ef] p-5 dark:border-white/10 dark:bg-[#101010] lg:flex lg:flex-col">
        <div className="flex min-h-[70px] items-center gap-2 rounded-lg border border-amber-500 bg-white p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] dark:bg-[#171717] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 text-base font-semibold">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-sm font-semibold text-white">3S</span>
            <span className="truncate tracking-tight">{t.shell.brand}</span>
          </Link>
          <ThemeSwitcher />
        </div>

        <label className="mt-4 flex min-h-12 items-center gap-3 rounded-lg border border-black/10 bg-black/[0.03] px-4 text-black/50 transition focus-within:border-black/20 focus-within:text-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55 dark:focus-within:border-white/20 dark:focus-within:text-white">
          <Search size={20} aria-hidden="true" />
          <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-black/40 dark:placeholder:text-white/45" placeholder="Search..." />
          <span className="rounded border border-black/10 px-2 py-0.5 text-xs text-black/45 dark:border-white/10 dark:text-white/45">⌘ K</span>
        </label>

        <nav className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1">
          <p className="mb-3 px-3 text-sm font-medium text-black/45 dark:text-white/45">{t.shell.operations}</p>
          <div className="grid gap-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-black/65 transition hover:bg-black/[0.05] hover:text-black dark:text-white/78 dark:hover:bg-white/[0.06] dark:hover:text-white",
                  pathname === item.href && "bg-amber-100 text-black dark:bg-amber-950/70 dark:text-white"
                )}
              >
                <item.icon size={20} />
                {t.nav[item.labelKey]}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-5 grid gap-3">
          <button className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-black/10 bg-black/[0.03] px-3 text-sm font-medium text-black transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]">
            <Settings size={18} />
            Settings
          </button>
          <LanguageSwitcher />
          <div className="rounded-lg border border-black/10 bg-black/[0.03] p-3 transition dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex min-h-[50px] items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-orange-600 to-amber-300 text-sm font-semibold text-white">{initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{fullName || roleLabels[role]}</span>
              <span className="block truncate text-xs font-semibold text-black/48 dark:text-white/48">
                {username ? `${username} - ${roleLabels[role]}` : "Session locale"}
              </span>
            </span>
            <ChevronsUpDown size={18} className="text-black/45 dark:text-white/45" />
            </div>
            <select
              className="mt-3 h-9 w-full rounded-lg border border-black/10 bg-white px-2 text-sm font-medium text-black outline-none dark:border-white/10 dark:bg-black/30 dark:text-white"
              value=""
              onChange={(event) => {
                if (event.target.value === "logout") logout();
              }}
            >
              <option value="" disabled>{accessToken ? t.common.account : t.common.notConnected}</option>
              <option value="logout">{t.common.logout}</option>
            </select>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-5 lg:ml-[352px] lg:px-10">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500 dark:text-amber-400">{t.shell.academicYear}</p>
            <h1 className="text-3xl font-semibold tracking-tight">{t.nav.dashboard}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block lg:hidden"><LanguageSwitcher compact /></div>
            <button className="hidden min-h-11 items-center gap-2 rounded-lg bg-black/[0.06] px-4 text-sm font-medium text-black transition hover:bg-black/[0.1] dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.12] md:inline-flex">
              <Sparkles size={18} />
              {t.dashboard.monitoring}
            </button>
            <button className="min-h-11 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(234,88,12,0.18)] transition hover:bg-orange-500">
              {t.common.live}
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
