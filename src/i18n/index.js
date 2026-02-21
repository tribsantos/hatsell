import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English
import enCommon from './locales/en/common.json';
import enLogin from './locales/en/login.json';
import enMeeting from './locales/en/meeting.json';
import enMotions from './locales/en/motions.json';
import enGuidance from './locales/en/guidance.json';
import enActions from './locales/en/actions.json';
import enModals from './locales/en/modals.json';
import enSettings from './locales/en/settings.json';
import enTutorials from './locales/en/tutorials.json';

// Portuguese (Brazil)
import ptBRCommon from './locales/pt-BR/common.json';
import ptBRLogin from './locales/pt-BR/login.json';
import ptBRMeeting from './locales/pt-BR/meeting.json';
import ptBRMotions from './locales/pt-BR/motions.json';
import ptBRGuidance from './locales/pt-BR/guidance.json';
import ptBRActions from './locales/pt-BR/actions.json';
import ptBRModals from './locales/pt-BR/modals.json';
import ptBRSettings from './locales/pt-BR/settings.json';
import ptBRTutorials from './locales/pt-BR/tutorials.json';

const savedLanguage = localStorage.getItem('hatsell_language');
const browserPt = typeof navigator !== 'undefined' && navigator.language.startsWith('pt');
const defaultLanguage = savedLanguage || (browserPt ? 'pt-BR' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        login: enLogin,
        meeting: enMeeting,
        motions: enMotions,
        guidance: enGuidance,
        actions: enActions,
        modals: enModals,
        settings: enSettings,
        tutorials: enTutorials
      },
      'pt-BR': {
        common: ptBRCommon,
        login: ptBRLogin,
        meeting: ptBRMeeting,
        motions: ptBRMotions,
        guidance: ptBRGuidance,
        actions: ptBRActions,
        modals: ptBRModals,
        settings: ptBRSettings,
        tutorials: ptBRTutorials
      }
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'login', 'meeting', 'motions', 'guidance', 'actions', 'modals', 'settings', 'tutorials'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
