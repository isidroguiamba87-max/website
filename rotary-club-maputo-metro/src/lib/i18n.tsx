"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/**
 * Sistema de idioma PT/EN.
 *
 * Cada texto do site é um par { pt, en } e o helper t() devolve a versão
 * do idioma ativo. O idioma escolhido fica guardado no browser do visitante.
 *
 * Nota: quando o clube quiser URLs separadas por idioma (/pt/..., /en/...),
 * isto pode evoluir para o i18n de rotas do Next.js sem tocar nos textos —
 * os pares { pt, en } continuam a servir de dicionário.
 */

export type Lang = "pt" | "en";
export type Bi = { pt: string; en: string };

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (bi: Bi) => string;
};

const LangContext = createContext<LangContextValue>({
  lang: "pt",
  setLang: () => {},
  t: (bi) => bi.pt,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Português por omissão — público principal é Moçambique.
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = window.localStorage.getItem("rcm-lang");
    if (saved === "pt" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("rcm-lang", l);
    document.documentElement.lang = l;
  };

  const t = (bi: Bi) => bi[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
