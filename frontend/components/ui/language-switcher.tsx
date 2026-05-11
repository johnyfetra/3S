"use client";

import { Languages } from "lucide-react";
import { useLanguageStore } from "@/lib/i18n/language-store";
import { useTranslation } from "@/lib/i18n/use-translation";
import type { Language } from "@/lib/i18n/translations";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, t } = useTranslation();
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-sm font-bold text-black shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.09]">
      <Languages size={16} aria-hidden="true" />
      {!compact ? <span>{t.common.language}</span> : null}
      <select
        aria-label={t.common.language}
        className="bg-[#fbf7ef] font-bold text-black outline-none dark:bg-[#111111] dark:text-white"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        <option value="en">{t.common.english}</option>
        <option value="fr">{t.common.french}</option>
      </select>
    </label>
  );
}
