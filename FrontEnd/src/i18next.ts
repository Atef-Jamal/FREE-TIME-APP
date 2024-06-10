import i18next from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18next
  .use(HttpBackend)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    // debug: true,
    backend: "/locales/{{lang}}/{{ns}}.json",
    ns: ["home", "rewards"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });

export default i18next;
