import { memo } from 'react'
import { getStoryType } from '../../utils'
import LangLink from '../LangLink'
import StoryPill from '../StoryPill'

function StoryListItem({ story }) {
  const type = getStoryType(story)
  const thumbUrl = story.covers[0]?.data?.resolutions?.thumbnail?.url
  console.log('~', thumbUrl)
  return (
    <LangLink to={`/story/${story.slug}`} className="no-link">
      <div className="border border-color-blacky d-flex flex-column align-items-start py-4 ps-6">
        <StoryPill type={type} />
        <h1 className="p-0 m-0 mt-2">{story.data.title}</h1>
        <div className="text-cadet-blue">
          Research by {story.authors.map((a) => a.fullname).join(', ')}
        </div>
      </div>
    </LangLink>
  )
}

export default memo(StoryListItem)
