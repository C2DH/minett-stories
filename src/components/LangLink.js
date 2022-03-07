import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/mobile'

/**
 * @param {{ to: string }} props
 */
export default function LangLink({ to, ...props }) {
  const { i18n } = useTranslation()
  const shortLang = i18n.language.split('_')[0]
  const isMobile = useIsMobile()
  const prefix = isMobile ? '/m' : ''
  return <Link {...props} to={`${prefix}/${shortLang}${to}`} />
}
