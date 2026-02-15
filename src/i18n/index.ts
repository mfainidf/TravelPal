import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import itTranslations from './it.json';

// Configurazione i18n con solo italiano
i18n
  .use(initReactI18next)
  .init({
    resources: {
      it: {
        translation: itTranslations
      }
    },
    lng: 'it', // Lingua predefinita: italiano
    fallbackLng: 'it', // Lingua di fallback: italiano
    interpolation: {
      escapeValue: false // React gestisce già l'escaping
    },
    react: {
      useSuspense: false // Disabilita suspense per evitare problemi di rendering
    }
  });

export default i18n;
