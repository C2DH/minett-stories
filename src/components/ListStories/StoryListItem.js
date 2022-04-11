import classNames from 'classnames'
import { memo } from 'react'
import { useIsMobile } from '../../hooks/mobile'
import { getStoryType } from '../../utils'
import LangLink from '../LangLink'
import StoryPill from '../StoryPill'
import styles from './ListStories.module.css'

function StoryListItem({ story }) {
  const type = getStoryType(story)
  const thumbUrl = story.covers[0]?.data?.resolutions?.thumbnail?.url
  const isMobile = useIsMobile()
  return (
    <LangLink to={`/story/${story.slug}`} className="no-link">
      <div
        className={classNames(`${styles.StoryBlockList} border-top border-bottom border-right border-color-blacky d-flex flex-column align-items-start py-4`, {
          'ps-6': !isMobile,
          'ps-3': isMobile
        })}
      >
        <div className="d-flex align-items-center">
          <div>
            {thumbUrl && (
              <img
                src={thumbUrl}
                // width={92}
                className={`${styles.ThumbPreview}`}
                alt={story.data.title}
              />
            )}
          </div>
          <div className={styles.StoryInfo}>
            <StoryPill type={type} />
            <h1 className="p-0 m-0 mt-2">{story.data.title}</h1>
            <div className="text-cadet-blue mt-2 mt-md-0">
              {story.authors.map((a) => a.fullname).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </LangLink>
  )
}

export default memo(StoryListItem)
