"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useThemeStore } from "@/lib/theme/theme-store";

export function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const hydrateTheme = useThemeStore((state) => state.hydrateTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-8 w-14 shrink-0 rounded-full border border-black/10 bg-black/15 p-1 transition hover:bg-black/20 dark:border-white/10 dark:bg-white/18 dark:hover:bg-white/24"
      title={isDark ? "Light" : "Dark"}
    >
      <span
        className={cn(
          "grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-white shadow-[0_8px_18px_rgba(234,88,12,0.28)] transition-transform duration-200",
          isDark ? "translate-x-6" : "translate-x-0"
        )}
      >
        {isDark ? <Moon size={15} fill="currentColor" /> : <Sun size={15} />}
      </span>
    </button>
  );
}
