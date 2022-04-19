import { useTranslation } from 'react-i18next'
import ChangeLangLink from '../../../components/ChangeLangLink'
import LangLink from '../../../components/LangLink'
import { LANGS } from '../../../i18n'
import styles from './Intro.module.css'
import bgHome from '../../../assets/bg-home.png'
import unilu from '../../../assets/unilu.png'
import c2dh from '../../../assets/c2dh.png'

export default function Intro() {
  const { i18n, t } = useTranslation()
  return (
    <div className={styles.Home} style={{ backgroundImage: `url(${bgHome}` }}>
      <div className={styles.CoverBackground}></div>
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
            className={`${styles.Char} TextABCMaxiSharpVariable}`}
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
        <h3 className={styles.subtitle}>
          {t('remixing_industrial')}
        </h3>
        <LangLink className={styles.HomeStart} to="/stories">
          {t('start')}
        </LangLink>
      </div>
      <div className={styles.LogoCredits}>
        <img src={c2dh} alt="C2dh" />
        <img src={unilu} alt="Unilu"  className='ms-2'/>
      </div>
    </div>
  )
}
