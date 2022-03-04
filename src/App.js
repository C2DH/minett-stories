import { Routes, Route, useParams, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { DEFAULT_LANG, LANGS, LANGS_SHORT } from './i18n'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Miller } from '@c2dh/react-miller'

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

function LangApp() {
  const { lang } = useParams()
  if (LANGS_SHORT.includes(lang)) {
    return (
      <>
        <SyncLang />
        <Outlet />
      </>
    )
  }
  return (
    <>
      <SyncLang />
      <NotFound />
    </>
  )
}

function App({ client, apiUrl }) {
  const { i18n } = useTranslation()
  return (
    <Miller client={client} apiUrl={apiUrl} langs={LANGS} lang={i18n.language}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={'/:lang/*'} element={<LangApp />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Miller>
  )
}

export default App
