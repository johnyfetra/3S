"use client";

import { useEffect } from "react";
import { translations } from "@/lib/i18n/translations";
import { useLanguageStore } from "@/lib/i18n/language-store";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const hydrateLanguage = useLanguageStore((state) => state.hydrateLanguage);

  useEffect(() => {
    hydrateLanguage();
  }, [hydrateLanguage]);

  return { language, t: translations[language] };
}

