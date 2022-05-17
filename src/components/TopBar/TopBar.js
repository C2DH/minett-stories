import { useState } from 'react'
import { Offcanvas, OffcanvasBody } from 'reactstrap'
import { Menu, X } from 'react-feather'
import ChangeLangLink from '../ChangeLangLink'
import unilu from './assets/logo_unilu.png'
import esch22 from './assets/logo_esch22.png'
import LangLink from '../LangLink'
import styles from './TopBar.module.css'
import { useTranslation } from 'react-i18next'
import { LANGS } from '../../i18n'
import NavLangLink from '../NavLangLink'
import { usePrefetchStory } from '@c2dh/react-miller'

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

function noop() {}

function InnerTopBar({
  prefetchStory = noop,
  right,
  linkUrlLogo = '/stories/voronoi',
}) {
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
                <LangLink
                  onMouseOver={() => {
                    prefetchStory('about')
                  }}
                  className={styles.MediumLink}
                  to="/about"
                >
                  {t('about')}
                </LangLink>
              </div>
              <div>
                <LangLink
                  onMouseOver={() => {
                    prefetchStory('education')
                  }}
                  className={styles.MediumLink}
                  to="/education"
                >
                  {t('education')}
                </LangLink>
              </div>
              <div>
                <LangLink
                  onMouseOver={() => {
                    prefetchStory('terms-of-use')
                  }}
                  className={styles.MediumLink}
                  to="/terms-of-use"
                >
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
              <a
                href="https://www.c2dh.uni.lu/"
                rel={'noreferrer'}
                target={'_blank'}
              >
                <img
                  src={unilu}
                  className={styles.unilu}
                  alt="Luxembourg Centre for Contemporary and digital History"
                />
              </a>
              <a
                className="ms-2"
                href="https://www.c2dh.uni.lu/"
                rel={'noreferrer'}
                target={'_blank'}
              >
                <img
                  src={esch22}
                  className={styles.esch22}
                  alt="Universitè du Luxembourg"
                />
              </a>
            </div>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </>
  )
}

function TopBarWithPrefetch(props) {
  const prefetchStory = usePrefetchStory()
  return <InnerTopBar prefetchStory={prefetchStory} {...props} />
}

export default function TopBar({ noPrefetch = false, ...props }) {
  if (noPrefetch) {
    return <InnerTopBar {...props} />
  } else {
    return <TopBarWithPrefetch {...props} />
  }
}
