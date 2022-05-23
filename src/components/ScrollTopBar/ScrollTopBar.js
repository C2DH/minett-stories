import classNames from 'classnames'
import { useEffect, useState } from 'react'
import TopBar from '../TopBar'
import styles from './ScrollTopBar.module.css'

export default function ScrollTopBar() {
  const [showTopBar, setShowTopBar] = useState(null)
  useEffect(() => {
    setShowTopBar(false)
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop
      setShowTopBar(scrollTop > 0)
    }
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <TopBar
      className={classNames(styles.TopbarFader, {
        [styles.TopbarFaderTransition]: showTopBar !== null,
        [styles.TopbarFaderIn]: Boolean(showTopBar),
        [styles.TopbarFaderOut]: !Boolean(showTopBar),
      })}
    />
  )
}
