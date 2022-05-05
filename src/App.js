import { Routes, Route, useParams, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Suspense, useEffect, useRef } from 'react'
import { Miller } from '@c2dh/react-miller'
import NotFound from './pages/NotFound'
import { DEFAULT_LANG, LANGS, LANGS_SHORT } from './i18n'
import NavigationWrapper from './components/NavigationWrapper'
import Loader from './components/Loader'
import Stories from './pages/Stories'
import Archive from './pages/Archive'
import Story from './pages/Story'
import DocDetail from './pages/DocDetail/DocDetail'
import ExploreStory from './pages/ExploreStory'
import ErrorBoundary from './ErrorBoundary'
import Intro from './pages/Intro'
import StoriesIntro from './pages/StoriesIntro'
import About from './pages/About'
import TermsOfUse from './pages/TermsOfUse/TermsOfUse'
import Education from './pages/Education'

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
  const location = useLocation()
  const prevLocation = useRef(null)

  useEffect(() => {
    prevLocation.current = location
  }, [location])

  // NOTE: Avoid "modal" model when no prev location
  // when user hit refresh page on modal should see non-modal version
  let backgroundLocation
  if (location.state?.backgroundLocation && prevLocation.current !== null) {
    backgroundLocation = location.state.backgroundLocation
  }

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path={':lang/*'} element={<SyncLang />} />
      </Routes>
      <Routes location={backgroundLocation ?? location}>
        <Route element={<NavigationWrapper />}>
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <Intro />
              </Suspense>
            }
          />
          <Route path={':lang/*'} element={<AvailablesLang />}>
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <Intro />
                </Suspense>
              }
            />
            <Route
              path="stories"
              element={
                <Suspense fallback={<Loader />}>
                  <StoriesIntro />
                </Suspense>
              }
            />
            <Route path="stories/:type" element={<Stories />} />
            <Route path="story/:slug" element={<Story />} />
            <Route
              path="story/:slug/explore"
              element={
                <Suspense fallback={<Loader />}>
                  <ExploreStory />
                </Suspense>
              }
            />
            <Route path="document/:slug" element={<DocDetail />} />
            <Route path="archive" element={<Archive />} />
            <Route path="archive/filter" element={<Archive />} />
            <Route path="about" element={<About />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="education" element={<Education />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path={':lang/*'} element={<AvailablesLang />}>
            <Route path="document/:slug" element={<DocDetail isModal />} />
          </Route>
        </Routes>
      )}
    </>
  )
}

function App({ client, apiUrl, requestsCache }) {
  const { i18n } = useTranslation()
  return (
    <ErrorBoundary>
      <Miller
        requestsCache={requestsCache}
        client={client}
        apiUrl={apiUrl}
        langs={LANGS}
        lang={i18n.language}
      >
        <Routes>
          <Route path="/*" element={<LangRoutes />} />
        </Routes>
      </Miller>
    </ErrorBoundary>
  )
}

export default App
