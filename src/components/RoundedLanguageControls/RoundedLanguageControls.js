import { useTranslation } from 'react-i18next'
import { LANGS } from '../../i18n'
import ChangeLangLink from '../ChangeLangLink'
import styles from './RoundedLanguageControls.module.css'

export default function RoundedLanguageControls({ className = '' }) {
  const { i18n } = useTranslation()
  return (
    <div className={`${styles.BlockLanguages} ${className}`}>
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
  )
}
