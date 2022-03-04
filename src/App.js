import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { DEFAULT_LANG, DEFAULT_LANG_SHORT, LANGS, LANGS_SHORT } from './i18n'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Miller } from '@c2dh/react-miller'

function LangApp({ children }) {
  const { lang } = useParams()
  if (LANGS_SHORT.includes(lang)) {
    return children
  }
  return <NotFound />
}

function SyncLang() {
  const { i18n } = useTranslation()
  const { lang } = useParams()

  useEffect(() => {
    const memoryLang = i18n.language.split('_')[0]
    if (memoryLang !== lang) {
      const nextLang = LANGS.find((l) => l.startsWith(lang)) ?? DEFAULT_LANG
      i18n.changeLanguage(nextLang)
    }
  }, [lang, i18n])

  return null
}

function App({ client, apiUrl }) {
  const { i18n } = useTranslation()
  return (
    <Miller client={client} apiUrl={apiUrl} langs={LANGS} lang={i18n.language}>
      <Routes>
        <Route
          path={'/:lang/*'}
          element={
            <LangApp>
              <SyncLang />
              <Layout />
            </LangApp>
          }
        >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LANG_SHORT}`} />} />
      </Routes>
    </Miller>
  )
}

export default App
