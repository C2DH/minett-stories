import { useTranslation } from 'react-i18next'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { useIsMobile } from '../hooks/mobile'
import { LANGS_SHORT } from '../i18n'

function cleanPathname(fullpath) {
  let path = fullpath
  if (path === '/m' || path.startsWith('/m/')) {
    path = fullpath.slice(2)
  }
  const m = matchPath('/:lang/*', path)
  if (m && LANGS_SHORT.includes(m.params.lang)) {
    path = '/' + m.params['*']
  }
  return path === '' ? '/' : path
}

/**
 * @param {{ lang: string }} props
 */
export default function ChangeLangLink({ lang, onClick, ...props }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const isMobile = useIsMobile()
  const prefix = isMobile ? '/m' : ''
  const shortLang = lang.split('_')[0]
  const to = `${prefix}/${shortLang}${cleanPathname(location.pathname)}`
  return (
    <Link
      onClick={() => {
        i18n.changeLanguage(lang)
        onClick && onClick()
      }}
      {...props}
      to={to}
    />
  )
}
