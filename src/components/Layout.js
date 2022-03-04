import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { LANGS } from '../i18n'

export default function Layout() {
  const { i18n } = useTranslation()
  return (
    <div>
      <b>{i18n.language}</b>
      <div>
        {LANGS.map((lang) => {
          const shortLang = lang.split('_')[0]
          return (
            <Link
              onClick={() => {
                i18n.changeLanguage(lang)
              }}
              key={lang}
              to={`/${shortLang}`}
            >
              {lang}
              {' | '}
            </Link>
          )
        })}
      </div>
      <Outlet />
    </div>
  )
}
