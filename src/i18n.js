import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { matchPath } from 'react-router-dom'
import resources from './translations.json'

export const LANGS = ['en_US', 'fr_FR', 'de_DE']

export const LANGS_SHORT = LANGS.map(l => l.split('_')[0])

export const DEFAULT_LANG = 'en_US'

export const DEFAULT_LANG_SHORT = DEFAULT_LANG.split('_')[0]

export function createI18n(pathname) {
  const i18nInstance = createInstance()
  i18nInstance
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: getStartLang(pathname),

      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    })
  return i18nInstance
}

export function getStartLang(pathname) {
  const langMatch = matchPath('/:lang/*', pathname)
  // No match use default lang
  if (!langMatch) {
    return DEFAULT_LANG
  }
  // Lang is on of configure...
  if (LANGS_SHORT.includes(langMatch.params.lang)) {
    // Find them...
    return LANGS.find(l => l.startsWith(langMatch.params.lang))
  }
  // Fallback 2 default one
  return DEFAULT_LANG
}
