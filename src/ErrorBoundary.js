import { Component, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import GentleRunTimeError from './components/GentleRunTimeError'
import NotFound from './pages/NotFound'

function ResetErrorOnLocationChange({ onReset }) {
  const location = useLocation()
  const prevLocationRef = useRef(location)
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      prevLocationRef.current = location
      onReset()
    }
  }, [location, onReset])
  return null
}

export default class ErrorBoundary extends Component {
  state = {
    error: null,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Catch da error', error, errorInfo)
  }

  onReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { children } = this.props
    const { error } = this.state
    if (error) {
      if (error.isAxiosError && error.response.status === 404) {
        return (
          <>
            <ResetErrorOnLocationChange onReset={this.onReset} />
            <NotFound />
          </>
        )
      }
      return (
        <>
          <ResetErrorOnLocationChange onReset={this.onReset} />
          <GentleRunTimeError />
        </>
      )
    }

    return children
  }
}
