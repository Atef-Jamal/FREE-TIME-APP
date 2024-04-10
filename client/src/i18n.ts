import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

i18n.use(languageDetector).use(initReactI18next).use(backend).init({
  debug: true,
  fallbackLng: "en",
});
