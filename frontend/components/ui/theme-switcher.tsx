"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
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
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-black/10 bg-black/[0.035] text-black/60 transition hover:bg-black/[0.07] hover:text-black dark:border-white/10 dark:bg-white/[0.055] dark:text-white/65 dark:hover:bg-white/[0.1] dark:hover:text-white"
      title={isDark ? "Light" : "Dark"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
