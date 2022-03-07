import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { useIsMobile } from '../hooks/mobile'
import { LANGS } from '../i18n'

export default function Layout() {
  const { i18n } = useTranslation()
  const shortLang = i18n.language.split('_')[0]
  const isMobile = useIsMobile()
  const prefix = isMobile ? '/m' : ''
  return (
    <div>
      <b>{i18n.language} </b>
      <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
      <div>
        <Link to={`${prefix}/${shortLang}/about`}>About</Link>
        {' | '}
        <Link to={`${prefix}/${shortLang}`}>Home</Link>
      </div>
      <div>
        {LANGS.map((lang) => {
          const shortLang = lang.split('_')[0]
          return (
            <Link
              onClick={() => {
                i18n.changeLanguage(lang)
              }}
              key={lang}
              to={`${prefix}/${shortLang}`}
            >
              {lang}
              {' | '}
            </Link>
          )
        })}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
