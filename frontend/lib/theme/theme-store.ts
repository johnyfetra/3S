"use client";

import { create } from "zustand";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "school-erp.theme";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  hydrateTheme: () => void;
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },
  hydrateTheme: () => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const theme: ThemeMode = stored === "light" || stored === "dark" ? stored : "dark";
    applyTheme(theme);
    set({ theme });
  }
}));

