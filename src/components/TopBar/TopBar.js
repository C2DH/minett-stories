import { useState } from 'react'
import { Offcanvas, OffcanvasBody } from 'reactstrap'
import { Menu, X } from 'react-feather'
import ChangeLangLink from '../ChangeLangLink'
import c2dh from './assets/c2dh.svg'
import unilu from './assets/unilu.svg'
import LangLink from '../LangLink'
import styles from './TopBar.module.css'
import { useTranslation } from 'react-i18next'
import { LANGS } from '../../i18n'
import NavLangLink from '../NavLangLink'

function LinkTop({ label, to }) {
  return (
    <NavLangLink
      className={({ isActive }) =>
        isActive ? styles.BigLinkAction : styles.BigLink
      }
      to={to}
    >
      {label}
    </NavLangLink>
  )
}

export default function TopBar({ right, linkUrlLogo = '/stories/voronoi' }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  return (
    <>
      <div className={styles.TopBar}>
        <div className="position-absolute left-topbar">
          {open ? (
            <X
              style={{ zIndex: 10000 }}
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            />
          ) : (
            <Menu className="cursor-pointer" onClick={() => setOpen(true)} />
          )}
        </div>
        <LangLink to={linkUrlLogo} className="TopBarMinettText">
          <div className="cursor-pointer">
            <span className="TextABCMaxiSharpRegular">M</span>
            <span className="TextABCMaxiSharpLight">i</span>
            <span className="TextABCMaxiSharpLight">n</span>
            <span className="TextABCMaxiRoundLight">e</span>
            <span className="TextABCMaxiRoundRegular">t</span>
            <span className="TextABCMaxiSharpLight">t</span>
            <span className="TextABCMaxiRoundRegular ms-2">S</span>
            <span className="TextABCMaxiSharpLight">t</span>
            <span className="TextABCMaxiSharpRegular">o</span>
            <span className="TextABCMaxiRoundLight">r</span>
            <span className="TextABCMaxiSharpRegular">i</span>
            <span className="TextABCMaxiRoundLight">e</span>
            <span className="TextABCMaxiRoundLight">s</span>
          </div>
        </LangLink>
        {right && (
          <div className="cursor-pointer position-absolute right-topbar">
            {right}
          </div>
        )}
      </div>
      <Offcanvas
        backdropClassName={styles.Backdrop}
        isOpen={open}
        toggle={() => setOpen(!open)}
        className={styles.Offcanvas}
      >
        <OffcanvasBody className={styles.OffcanvasBody}>
          <div className="d-flex flex-column">
            <LinkTop to="/" label={t('intro')} />
            <LinkTop to="/stories/voronoi" label={t('stories')} />
            <LinkTop to="/archive" label={t('archive')} />
            <LinkTop to="/about" label={t('about')} />
          </div>
          <div className={styles.OffcanvasBottom}>
            <div className={styles.BlockLanguages}>
              {LANGS.map((lang) => (
                <ChangeLangLink
                  key={lang}
                  className={
                    i18n.language === lang
                      ? styles.ChangeLangLinkActive
                      : styles.ChangeLangLink
                  }
                  lang={lang}
                >
                  {lang.split('_')[0]}
                </ChangeLangLink>
              ))}
            </div>
            <div className={styles.BlockTerms}>
              <div>
                <LangLink className={styles.MediumLink} to="/">
                  {t('terms_of_use')}
                </LangLink>
              </div>
              <div>
                <a className={styles.MediumLink} href={'mailto:c2dh@uni.lu'}>
                  {t('contact_us')}
                </a>
              </div>
            </div>
            <div>
              <img
                src={c2dh}
                className={styles.c2dh}
                alt="Luxembourg Centre for Contemporary and digital History"
              />
              <img
                src={unilu}
                className={styles.logoUnilu}
                alt="Universitè du Luxembourg"
              />
            </div>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </>
  )
}
