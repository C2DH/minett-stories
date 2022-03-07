import { useState } from 'react'
import { Offcanvas, OffcanvasBody } from 'reactstrap'
import LangLink from '../LangLink'
import styles from './TopBar.module.css'

export default function TopBar({ right }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={styles.TopBar}>
        <div>
          <i
            onClick={() => {
              setOpen(!open)
            }}
            style={{ fontSize: '2rem' }}
            className="bi bi-list cursor-pointer"
          />
        </div>
        <div>Minett Stories</div>
        {right ? right : <span />}
      </div>
      <Offcanvas
        isOpen={open}
        toggle={() => setOpen(!open)}
        className={styles.Offcanvas}
      >
        <OffcanvasBody className={styles.OffcanvasBody}>
          <LangLink to="/">Intro</LangLink>
          <LangLink to="/stories">Stories</LangLink>
          <LangLink to="/archive">Archive</LangLink>
          <LangLink to="/about">About</LangLink>
        </OffcanvasBody>
      </Offcanvas>
    </>
  )
}
