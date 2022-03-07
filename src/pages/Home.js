import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../hooks/mobile'

export default function Home() {
  const { t, i18n } = useTranslation()

  const isMobile = useIsMobile()
  const [counter, setCounter] = useState(0)
  return (
    <div>
      {/* <button onClick={() => {
        i18n.changeLanguage('fr_FR')
      }}>Foo</button> */}
      <button onClick={() => setCounter(c => c+1)}>{counter}</button>
      <h1>{t('hello')}</h1>
      {i18n.language}
      <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
    </div>
  )
}
