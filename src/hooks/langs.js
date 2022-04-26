import { useTranslation } from 'react-i18next'

export function useLangPathPrefix() {
  const { i18n } = useTranslation()
  const shortLang = i18n.language.split('_')[0]
  const prefix = ''
  return `${prefix}/${shortLang}`
}