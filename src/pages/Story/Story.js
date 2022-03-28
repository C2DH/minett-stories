import findIndex from 'lodash/findIndex'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight } from 'react-feather'
import Layout from '../../components/Layout'
import { useStories, useStoryWithChapters } from '@c2dh/react-miller'
import { getStoryType } from '../../utils'
import StoryPill from '../../components/StoryPill'
import VisualModule from '../../components/VisualModule'
import styles from './Story.module.css'
import LangLink from '../../components/LangLink'

export default function Story() {
  const { slug } = useParams()
  const [storiesList] = useStories({
    params: {
      limit: 1000,
      filters: {
        tags__slug__in: ['theme'],
      },
    },
  })
  const [story] = useStoryWithChapters(slug)
  const coverImage = story.covers?.[0]?.attachment
  const type = getStoryType(story)

  // NOTE: lol this is a super naive approach but U now
  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]

  const [goDeeper, setGoDeeper] = useState(false)

  const [prevSlug, nextSlug] = useMemo(() => {
    const i = findIndex(storiesList.results, (s) => s.slug === slug)
    const prevIndex = i > 0 ? i - 1 : storiesList.results.length - 1
    const nextIndex = i < storiesList.results.length - 1 ? i + 1 : 0
    return [
      storiesList.results[prevIndex].slug,
      storiesList.results[nextIndex].slug,
    ]
  }, [slug, storiesList.results])

  return (
    <Layout>
      <div className="padding-top-bar" />
      <div className={`${styles.Cover}`}>
        <div
          className={styles.CoverGreyScaledImage}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={`${styles.CoverBlend} bg-story-${type}`} />
        <LangLink
          to={`/story/${slug}/explore`}
          className={`${styles.ConverExplore}`}
        >
          Watch
        </LangLink>
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
        {goDeeper && (
          <div>
            {longScrollStory.contents.modules.map((millerModule, i) => (
              <VisualModule key={i} millerModule={millerModule} />
            ))}
          </div>
        )}
        <LangLink
          onClick={() => setGoDeeper(false)}
          to={`/story/${prevSlug}`}
          className={`${styles.LeftButtonStory} btn-circle cursor-pointer no-link`}
        >
          <ArrowLeft />
        </LangLink>
        <LangLink
          onClick={() => setGoDeeper(false)}
          to={`/story/${nextSlug}`}
          className={`${styles.RightButtonStory} btn-circle cursor-pointer no-link`}
        >
          <ArrowRight />
        </LangLink>
      </div>
    </Layout>
  )
}
