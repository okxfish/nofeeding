import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en, zh } from "./locals";
const resources = {
    en: en,
    zh: zh,
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh',
        fallbackLng: "zh",
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
