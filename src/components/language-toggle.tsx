"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang, STRINGS } from "@/lib/i18n";

const STORAGE_KEY = "noor-ul-quran-lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof STRINGS)[Lang];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return value;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ur");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const next = saved === "en" || saved === "ur" ? saved : "ur";
    setLangState(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ur" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, ready]);

  function setLang(next: Lang) {
    setLangState(next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === "ur" ? "active" : ""}
        onClick={() => setLang("ur")}
      >
        اردو
      </button>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => setLang("en")}
      >
        English
      </button>
    </div>
  );
}
