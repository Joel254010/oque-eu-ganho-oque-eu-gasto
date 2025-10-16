// src/components/LanguageSwitcher.tsx
import React from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "pt", label: "PT 🇧🇷" },
  { code: "en", label: "EN 🇺🇸" },
  { code: "es", label: "ES 🇪🇸" },
  { code: "fr", label: "FR 🇫🇷" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    // opcional: gravar preferência
    localStorage.setItem("app_lang", lang);
    // opcional: refletir no <html lang="...">
    document.documentElement.setAttribute("lang", lang);
  }

  // idioma atual (prioriza o definido no i18n, senão localStorage)
  const current =
    i18n.resolvedLanguage ||
    localStorage.getItem("app_lang") ||
    "pt";

  return (
    <select
      aria-label="Selecionar idioma"
      value={current}
      onChange={handleChange}
      style={{
        padding: "6px 10px",
        borderRadius: 10,
        border: "1px solid #E6EAF2",
        background: "#fff",
        fontSize: 14,
        cursor: "pointer"
      }}
    >
      {LANGS.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
