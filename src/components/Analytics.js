import { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useLocation } from 'react-router-dom'

const gaCode = process.env.REACT_APP_GA_CODE
const gaEnabled = Boolean(!process.env.IS_SNEXT_SERVER && gaCode)
if (gaEnabled) {
  ReactGA.initialize(gaCode, {
    debug: process.env.NODE_ENV === 'development',
  })
}

function trackVisit(path) {
  if (gaEnabled) {
    ReactGA.pageview(path)
  }
}

export default function Anaylitcs() {
  const location = useLocation()
  const path = location.pathname + location.search
  useEffect(() => {
    trackVisit(path)
  }, [path])
  return null
}
