import styles from './Intro.module.css'
import intro1 from '../../assets/intro1.jpg'
import intro2 from '../../assets/intro2.jpg'
import intro3 from '../../assets/intro3.jpg'
import unilu from '../../assets/logo_unilu.png'
import esch22 from '../../assets/logo_esch22.png'
import LangLink from '../../components/LangLink'
import RoundedLanguageControls from '../../components/RoundedLanguageControls/RoundedLanguageControls'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

export default function Intro() {
  const { t } = useTranslation()
  const backgrounds = [intro1, intro2, intro3]
  const [position, setPosition] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      if (position === 2) setPosition(0)
      else setPosition(position + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [position])

  return (
    <div
      className={styles.Home}
      style={{ backgroundImage: `url(${backgrounds[position]}` }}
    >
      <Helmet defer={false}>
        <title>{`Minett Stories`}</title>
      </Helmet>
      <RoundedLanguageControls className={styles.BlockLanguages} />
      <div className={styles.BlockTextHome}>
        <h1 className={`${styles.HomeMinettText}`}>
          <span className={`${styles.Char400} TextABCMaxiSharpVariable`}>
            M
          </span>
          <span className={`${styles.Char200} TextABCMaxiSharpVariable`}>
            i
          </span>
          <span className={`${styles.Char200} TextABCMaxiSharpVariable`}>
            n
          </span>
          <span className={`${styles.Char200} TextABCMaxiRoundVariable`}>
            e
          </span>
          <span className={`${styles.Char400} TextABCMaxiRoundVariable`}>
            t
          </span>
          <span className={`${styles.Char200} TextABCMaxiSharpVariable`}>
            t
          </span>
          <span className={`${styles.Char400} ms-2 TextABCMaxiRoundVariable`}>
            S
          </span>
          <span className={`${styles.Char200} TextABCMaxiSharpVariable`}>
            t
          </span>
          <span className={`${styles.Char400} TextABCMaxiSharpVariable`}>
            o
          </span>
          <span className={`${styles.Char200} TextABCMaxiRoundVariable`}>
            r
          </span>
          <span className={`${styles.Char400} TextABCMaxiSharpVariable`}>
            i
          </span>
          <span className={`${styles.Char200} TextABCMaxiRoundVariable`}>
            e
          </span>
          <span className={`${styles.Char200} TextABCMaxiRoundVariable`}>
            s
          </span>
        </h1>
        <h3 className={styles.subtitle}>{t('remixing_industrial')}</h3>
        <LangLink className={`${styles.LinkExplore} no-link`} to="/stories">
          <div className={styles.Gooey}>{t('start')}</div>
        </LangLink>
      </div>
      <div className={styles.LogoCredits}>
        <a href="https://www.c2dh.uni.lu/" rel={'noreferrer'} target={'_blank'}>
          <img src={unilu} alt="Unilu" className={`${styles.unilu}`} />
        </a>
        <a
          className="ms-2"
          href="https://www.c2dh.uni.lu/"
          rel={'noreferrer'}
          target={'_blank'}
        >
          <img src={esch22} alt="Esch22" className={`${styles.esch22}`} />
        </a>
      </div>
      <LangLink to="/stories/voronoi" className="no-link">
        <div className={styles.SkipIntro}>{t('skipIntro')}</div>
      </LangLink>
    </div>
  )
}
