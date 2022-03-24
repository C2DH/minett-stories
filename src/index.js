import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, hydrate } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { createI18n } from './i18n'
import { I18nextProvider } from 'react-i18next'
import reportWebVitals from './reportWebVitals'
import App from './App'

// add information on version on startup
console.info('%cMinett Stories', 'font-weight: bold',
  process.env.REACT_APP_GIT_TAG || '(latest)',
  process.env.REACT_APP_GIT_BRANCH,
  `\nhttps://github.com/C2DH/minett-stories/commit/${process.env.REACT_APP_GIT_REVISION}`
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      staleTime: Infinity,
      retry: false,
      suspense: true,
    },
  },
})

if (typeof window.__INITIAL_DATA__ !== 'undefined') {
  hydrate(queryClient, window.__INITIAL_DATA__)
  delete window.__INITIAL_DATA__
}

const i18n = createI18n(window.location.pathname)

const clientApiUrl = '/api'

const rootElement = document.getElementById('root')

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement,
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <App client={queryClient} apiUrl={clientApiUrl} />
      </I18nextProvider>
    </BrowserRouter>
  )
} else {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <App client={queryClient} apiUrl={clientApiUrl} />
        </I18nextProvider>
      </BrowserRouter>
    </React.StrictMode>,
    rootElement
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
