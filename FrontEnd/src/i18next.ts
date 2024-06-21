import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18next
  .use(HttpBackend)
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
