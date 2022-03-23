import { memo } from 'react'
import { getStoryType } from '../../utils'
import LangLink from '../LangLink'
import { useTranslation } from 'react-i18next'
import { STORY_ICONS } from '../../consts'

function StoryListItem({ story }) {
  const { t } = useTranslation()
  const type = getStoryType(story)
  return (
    <LangLink to="/" className="no-link">
      <div className="border border-color-blacky d-flex flex-column align-items-start py-4 ps-6">
        <div
          className={`rounded-pill bg-story-${type} px-2 d-flex align-items-center`}
        >
          <img src={STORY_ICONS[type]} alt={`Icon ${type}`} className="me-2" />
          <span className="text-uppercase">{t(`story-${type}`)}</span>
        </div>
        <h1 className="p-0 m-0 mt-2">{story.data.title}</h1>
        <div className="text-cadet-blue">
          Research by {story.authors.map((a) => a.fullname).join(', ')}
        </div>
      </div>
    </LangLink>
  )
}

export default memo(StoryListItem)
