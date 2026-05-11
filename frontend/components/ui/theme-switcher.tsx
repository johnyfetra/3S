"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useThemeStore, type ThemeMode } from "@/lib/theme/theme-store";

const options: Array<{ value: ThemeMode; icon: typeof Sun; label: string }> = [
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" }
];

export function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const hydrateTheme = useThemeStore((state) => state.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-black/10 bg-black/[0.04] p-1 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Theme">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={theme === option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "grid min-h-10 place-items-center rounded-md text-black/55 transition hover:bg-black/[0.06] hover:text-black dark:text-white/55 dark:hover:bg-white/[0.08] dark:hover:text-white",
            theme === option.value && "bg-white text-amber-700 shadow-sm dark:bg-white/12 dark:text-amber-300"
          )}
        >
          <option.icon size={18} />
        </button>
      ))}
    </div>
  );
}

