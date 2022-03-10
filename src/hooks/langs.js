import { useTranslation } from "react-i18next"
import { useIsMobile } from "./mobile"

export function useLangPathPrefix() {
  const { i18n } = useTranslation()
  const shortLang = i18n.language.split('_')[0]
  const isMobile = useIsMobile()
  const prefix = isMobile ? '/m' : ''
  return `${prefix}/${shortLang}`
}