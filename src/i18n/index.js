import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const NAMESPACES = ['common', 'login', 'meeting', 'motions', 'guidance', 'actions', 'modals', 'settings', 'tutorials'];
const SUPPORTED_LANGUAGES = ['en', 'pt-BR'];
const SESSION_LANGUAGE_KEY = 'hatsell_language_session';
const PERSISTED_LANGUAGE_KEY = 'hatsell_language';

const localeLoaders = {
  en: {
    common: () => import('./locales/en/common.json'),
    login: () => import('./locales/en/login.json'),
    meeting: () => import('./locales/en/meeting.json'),
    motions: () => import('./locales/en/motions.json'),
    guidance: () => import('./locales/en/guidance.json'),
    actions: () => import('./locales/en/actions.json'),
    modals: () => import('./locales/en/modals.json'),
    settings: () => import('./locales/en/settings.json'),
    tutorials: () => import('./locales/en/tutorials.json')
  },
  'pt-BR': {
    common: () => import('./locales/pt-BR/common.json'),
    login: () => import('./locales/pt-BR/login.json'),
    meeting: () => import('./locales/pt-BR/meeting.json'),
    motions: () => import('./locales/pt-BR/motions.json'),
    guidance: () => import('./locales/pt-BR/guidance.json'),
    actions: () => import('./locales/pt-BR/actions.json'),
    modals: () => import('./locales/pt-BR/modals.json'),
    settings: () => import('./locales/pt-BR/settings.json'),
    tutorials: () => import('./locales/pt-BR/tutorials.json')
  }
};

function getStoredLanguage() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SESSION_LANGUAGE_KEY) || localStorage.getItem(PERSISTED_LANGUAGE_KEY);
}

function getDefaultLanguage() {
  const savedLanguage = getStoredLanguage();
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) return savedLanguage;
  const browserPt = typeof navigator !== 'undefined' && navigator.language.startsWith('pt');
  return browserPt ? 'pt-BR' : 'en';
}

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: NAMESPACES,
    interpolation: {
      escapeValue: false
    },
    react: { useSuspense: false }
  });

async function loadNamespace(language, namespace) {
  const normalizedLanguage = normalizeLanguage(language);
  if (i18n.hasResourceBundle(normalizedLanguage, namespace)) return;

  const load = localeLoaders[normalizedLanguage]?.[namespace];
  if (!load) return;

  const module = await load();
  const bundle = module.default || module;
  i18n.addResourceBundle(normalizedLanguage, namespace, bundle, true, true);
}

export async function loadLanguageResources(language) {
  const normalizedLanguage = normalizeLanguage(language);
  await Promise.all(NAMESPACES.map((namespace) => loadNamespace(normalizedLanguage, namespace)));

  // Keep fallback bundles available for missing keys.
  if (normalizedLanguage !== 'en') {
    await Promise.all(NAMESPACES.map((namespace) => loadNamespace('en', namespace)));
  }
}

export async function changeAppLanguage(language, options = {}) {
  const { persist = 'session' } = options;
  const normalizedLanguage = normalizeLanguage(language);
  await loadLanguageResources(normalizedLanguage);
  await i18n.changeLanguage(normalizedLanguage);

  if (typeof window !== 'undefined') {
    if (persist === 'session') {
      sessionStorage.setItem(SESSION_LANGUAGE_KEY, normalizedLanguage);
      localStorage.setItem(PERSISTED_LANGUAGE_KEY, normalizedLanguage);
    } else if (persist === 'local') {
      localStorage.setItem(PERSISTED_LANGUAGE_KEY, normalizedLanguage);
    }
  }
}

export const i18nReady = (async () => {
  await loadLanguageResources(i18n.language || 'en');
  await i18n.changeLanguage(normalizeLanguage(i18n.language || 'en'));
})();

export default i18n;
