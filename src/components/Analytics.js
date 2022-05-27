import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'


function getLocalStorageAcceptedValue({key, initialValue}) {
  if (typeof window === "undefined") {
    return initialValue;
  }

  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    console.debug('[getLocalStorageAcceptedValue]', key, item)
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    // If error also return initialValue
    console.warn(error);
    return initialValue;
  }
}


const gaCode = process.env.REACT_APP_GA_CODE
const gaAccepted = getLocalStorageAcceptedValue({
  key: process.env.REACT_APP_GA_ACCEPTED_STORAGE_KEY,
  initialValue: true,
})
const gaEnabled = Boolean(!process.env.IS_SNEXT_SERVER && gaCode && gaAccepted)

console.info(
  '%cGoogle Analitics',
  'font-weight: bold;',
  gaEnabled ? 'enabled' : 'disabled',
  typeof gaCode === 'string' ? gaCode : '(no GA tracker defined)',
  gaAccepted ? '' : '(GA refused from user)'
)

if (gaEnabled) {
  ReactGA.initialize(gaCode, {
    debug: process.env.NODE_ENV === 'development',
  })
}

function trackVisit(page) {
  if (gaEnabled) {
    console.debug('[trackVisit] ReactGA pageview:', page)
    ReactGA.send({
      hitType: "pageview",
      page
    });
  }
}

export default function Anaylitcs() {
  console.debug('[Anaylitcs] rendered')

  const location = useLocation()
  const path = location.pathname + location.search
  useEffect(() => {
    trackVisit(path)
  }, [path])
  return null
}
