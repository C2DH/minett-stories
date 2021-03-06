import { useTranslation } from 'react-i18next'
import { STORY_ICONS } from '../consts'

export default function StoryPill({ type }) {
  const { t } = useTranslation()
  return (
    <div
      className={`rounded-pill text-story-pill bg-story-${type} px-2 d-flex align-items-center text-white width-fit-content`}
    >
      <img src={STORY_ICONS[type]} alt={`Icon ${type}`} className="me-2" />
      <span className="text-uppercase">{t(`story-${type}`)}</span>
    </div>
  )
}
