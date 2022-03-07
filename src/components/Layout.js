import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { useIsMobile } from '../hooks/mobile'
import { LANGS } from '../i18n'
import ChangeLangLink from './ChangeLangLink'
import LangLink from './LangLink'

export default function Layout() {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  return (
    <div>
      <b>{i18n.language} </b>
      <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
      <div>
        <LangLink to="/about">About</LangLink>
        {' | '}
        <LangLink to="/">Home</LangLink>
      </div>
      <div>
        {LANGS.map((lang) => (
          <ChangeLangLink lang={lang} key={lang}>
            {lang}{' | '}
          </ChangeLangLink>
        ))}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
