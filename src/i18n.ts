// ✅ src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 🌍 Importa as traduções de cada idioma
import pt from "./locales/pt/translation.json";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pt",
    supportedLngs: ["pt", "en", "es", "fr"], // ✅ evita erro de detecção automática
    debug: false,
    interpolation: {
      escapeValue: false, // ✅ React já faz escaping automaticamente
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "cookie", "path", "subdomain"],
      caches: ["localStorage"],
    },
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    // ✅ fallback seguro se a chave não for encontrada
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`⚠️ Tradução ausente: [${lng}] ${key}`);
    },
  });

export default i18n;
