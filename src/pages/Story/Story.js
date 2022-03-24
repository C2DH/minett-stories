import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDown } from 'react-feather'
import Layout from '../../components/Layout'
import { useStoryWithChapters } from '@c2dh/react-miller'
import styles from './Story.module.css'
import { getStoryType } from '../../utils'
import StoryPill from '../../components/StoryPill'
import VisualModule from '../../components/VisualModule'

export default function Story() {
  const { slug } = useParams()
  const [story] = useStoryWithChapters(slug)
  const coverImage = story.covers?.[0]?.attachment
  const type = getStoryType(story)

  // NOTE: lol this is a super naive approach but U now
  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]

  const [goDeeper, setGoDeeper] = useState(false)

  return (
    <Layout>
      <div className="padding-top-bar" />
      <div className={`${styles.Cover}`}>
        <div
          className={styles.CoverGreyScaledImage}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={`${styles.CoverBlend} bg-story-${type}`} />
      </div>
      <div className={styles.Content}>
        <div className="row pt-4 text-black">
          <div className="col-md-6 offset-md-3 d-flex flex-column align-items-start">
            <StoryPill type={type} />
            <h1 className="m-0 p-0 mt-3">{story.data.title}</h1>
            <div className="text-cadet-blue mt-3">
              Research by {story.authors.map((a) => a.fullname).join(', ')}
            </div>
            <p className="mt-3">{story.data.abstract}</p>
            {!goDeeper && (
              <div
                onClick={() => setGoDeeper(true)}
                className="w-100 d-flex flex-column align-items-center cursor-pointer mb-4"
              >
                <div className={`text-color-story-${type}`}>
                  Go deeper (10 min.)
                </div>
                <ArrowDown color={`var(--color-story-${type})`} />
              </div>
            )}
          </div>
        </div>
      </div>
      {goDeeper && (
        <div>
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </Layout>
  )
}
