import styles from './Intro.module.css'
import bgHome from '../../assets/bg-home.png'
import backgroundStoryLink from '../../assets/ellipse-story.svg'
import unilu from '../../assets/unilu.png'
import c2dh from '../../assets/c2dh.png'
import LangLink from '../../components/LangLink'
import RoundedLanguageControls from '../../components/RoundedLanguageControls/RoundedLanguageControls'
import { useTranslation } from 'react-i18next'

export default function Intro() {
  const { t } = useTranslation()
  return (
    <div className={styles.Home} style={{ backgroundImage: `url(${bgHome}` }}>
      <div className={styles.CoverBackground}></div>
      <RoundedLanguageControls className={styles.BlockLanguages} />
      <div className={styles.BlockTextHome}>
        <h1 className={`${styles.HomeMinettText} text-center`}>
          <span
            className={`${styles.Char} TextABCMaxiSharpRegular`}
            style={{ '--span-index': 0 }}
          >
            M
          </span>
          <span
            className={`${styles.Char} TextABCMaxiSharpVariable`}
            style={{ '--span-index': 1 }}
          >
            i
          </span>
          <span
            className={`${styles.Char} TextABCMaxiSharpVariable`}
            style={{ '--span-index': 2 }}
          >
            n
          </span>
          <span
            className={`${styles.Char} TextABCMaxiRoundVariable`}
            style={{ '--span-index': 3 }}
          >
            e
          </span>
          <span
            className={`${styles.Char} TextABCMaxiRoundVariable`}
            style={{ '--span-index': 4 }}
          >
            t
          </span>
          <span
            className={`${styles.Char} TextABCMaxiSharpVariable`}
            style={{ '--span-index': 5 }}
          >
            t
          </span>
          <span
            style={{ '--span-index': 6 }}
            className={`${styles.Char} ms-2 TextABCMaxiRoundVariable`}
          >
            S
          </span>
          <span
            className={`${styles.Char} TextABCMaxiSharpVariable`}
            style={{ '--span-index': 7 }}
          >
            t
          </span>
          <span
            className={`${styles.Char} TextABCMaxiSharpVariable`}
            style={{ '--span-index': 8 }}
          >
            o
          </span>
          <span
            className={`${styles.Char} TextABCMaxiRoundVariable`}
            style={{ '--span-index': 9 }}
          >
            r
          </span>
          <span
            className={`${styles.Char} TextABCMaxiSharpVariable`}
            style={{ '--span-index': 10 }}
          >
            i
          </span>
          <span
            className={`${styles.Char} TextABCMaxiRoundVariable`}
            style={{ '--span-index': 11 }}
          >
            e
          </span>
          <span
            className={`${styles.Char} TextABCMaxiRoundVariable`}
            style={{ '--span-index': 12 }}
          >
            s
          </span>
        </h1>
        <h3 className={styles.subtitle}>{t('remixing_industrial')}</h3>
        <LangLink
          style={{ backgroundImage: `url(${backgroundStoryLink})` }}
          className={styles.HomeStart}
          to="/stories"
        >
          {t('start')}
        </LangLink>
      </div>
      <div className={styles.LogoCredits}>
        <img src={c2dh} alt="C2dh" />
        <img src={unilu} alt="Unilu" className="ms-2" />
      </div>
    </div>
  )
}
