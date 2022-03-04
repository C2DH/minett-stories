import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initI18n } from './i18n'
import reportWebVitals from './reportWebVitals'

initI18n(window.location.pathname)

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
      suspense: false,
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App client={queryClient} apiUrl={'/api'} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
