"use client";

import { create } from "zustand";
import type { Language } from "@/lib/i18n/translations";

const STORAGE_KEY = "school-erp.language";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
  hydrateLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (language) => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    set({ language });
  },
  hydrateLanguage: () => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const language = stored === "fr" || stored === "en" ? stored : "en";
    document.documentElement.lang = language;
    set({ language });
  }
}));

