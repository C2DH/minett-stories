import {
  Routes,
  Route,
  useParams,
  Outlet,
  matchPath,
  useNavigate,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Miller } from '@c2dh/react-miller'
import Layout from './components/Layout'
import About from './pages/About'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { DEFAULT_LANG, LANGS, LANGS_SHORT } from './i18n'

// NOTE: This sync lang when changed from push state navigation
// (user press back, forward history)
function SyncLang() {
  const { i18n } = useTranslation()
  const { lang } = useParams()

  useEffect(() => {
    const memoryLang = i18n.language.split('_')[0]
    if (memoryLang !== lang) {
      const nextLang = LANGS.find((l) => l.startsWith(lang)) ?? DEFAULT_LANG
      if (nextLang !== i18n.language) {
        i18n.changeLanguage(nextLang)
      }
    }
  }, [lang, i18n])

  return null
}

function AvailablesLang() {
  const { lang } = useParams()
  if (LANGS_SHORT.includes(lang)) {
    return <Outlet />
  }
  return <NotFound />
}

function LangRoutes() {
  return (
    <>
      <Routes>
        <Route path={':lang/*'} element={<SyncLang />} />
      </Routes>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={':lang/*'} element={<AvailablesLang />}>
            <Route index element={<Home />} />
            <Route path="a/lot/of/path" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

function CheckClientSideScreenDimensions() {
  const navigate = useNavigate()
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    function handleChange() {
      const isScreenMobile = media.matches
      const isMobile = matchPath('/m/*', window.location.pathname)
      if (isScreenMobile && !isMobile) {
        // You are on a mobile screen but site is rendered as desktop
        const confirmed = window.confirm('Use mobile version?')
        if (confirmed) {
          navigate('/m')
        }
      } else if (!isScreenMobile && isMobile) {
        // You are on a desktop scren but site is rendered as mobile
        const confirmed = window.confirm('Use desktop version?')
        if (confirmed) {
          navigate('/')
        }
      }
    }
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [navigate])

  return null
}

function App({ client, apiUrl }) {
  const { i18n } = useTranslation()
  return (
    <Miller client={client} apiUrl={apiUrl} langs={LANGS} lang={i18n.language}>
      <Routes>
        <Route path="/*" element={<CheckClientSideScreenDimensions />} />
      </Routes>
      <Routes>
        {/* MOBILE */}
        <Route path="/m/*" element={<LangRoutes />} />
        {/* DESKTOP */}
        <Route path="/*" element={<LangRoutes />} />
      </Routes>
    </Miller>
  )
}

export default App
