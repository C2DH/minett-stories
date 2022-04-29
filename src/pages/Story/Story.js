import findIndex from 'lodash/findIndex'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight } from 'react-feather'
import { useTranslation } from 'react-i18next'
import Layout from '../../components/Layout'
import { useStories, useStoryWithChapters } from '@c2dh/react-miller'
import { getStoryType } from '../../utils'
import StoryPill from '../../components/StoryPill'
import VisualModule from '../../components/VisualModule'
import styles from './Story.module.css'
import LangLink from '../../components/LangLink'

function ExpolorLink({ slug, type }) {
  const { t } = useTranslation()
  if (type === 'article') {
    return null
  }
  let label
  switch (type) {
    case 'video':
    case 'interactive-video':
      label = t('watch')
      break
    case 'audio':
      label = t('listen')
      break
    case 'graphic-novel':
      label = t('start')
      break
    default:
      label = t('explore')
  }
  return (
    <LangLink
      to={`/story/${slug}/explore`}
      className={`${styles.ConverExplore}`}
      // style={{ backgroundImage: `url(${backgroundStoryLink})` }}
    >
      <div>{label}</div>
    </LangLink>
  )
}

export default function Story() {
  const { slug } = useParams()
  const [storiesList] = useStories({
    params: {
      limit: 1000,
      filters: {
        tags__slug__in: ['theme'],
      },
      exclude: {
        tags__slug__in: ['intro'],
      },
    },
  })
  const [story] = useStoryWithChapters(slug)
  const coverImage =
    story.covers?.[0]?.data?.resolutions?.preview?.url ??
    story.covers?.[0]?.attachment
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

  const { t } = useTranslation()

  return (
    <Layout>
      <div className="padding-top-bar" />
      <div className={`${styles.Cover}`}>
        <div
          className={styles.CoverGreyScaledImage}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={`${styles.CoverBlend} bg-story-${type}`} />
        <ExpolorLink slug={slug} type={type} />
      </div>
      <div className={styles.Content}>
        <div className="row pt-4 text-black">
          <div className="col-md-6 offset-md-3 d-flex flex-column align-items-start">
            <StoryPill type={type} />
            <h1 className={`${styles.TitleStory} m-0 p-0 mt-3`}>
              {story.data.title}
            </h1>
            <div className={`${styles.ResearchText} text-cadet-blue mt-3`}>
              {story.authors.map((a) => a.fullname).join(', ')}
            </div>
            <p className={`${styles.AbstractText} mt-3`}>
              {story.data.abstract}
            </p>
            {!goDeeper && type !== 'article' && (
              <div
                onClick={() => setGoDeeper(true)}
                className="w-100 d-flex flex-column align-items-center cursor-pointer mb-4"
              >
                <div
                  className={`${styles.GoDeeperText} text-color-story-${type}`}
                >
                  {t('go_deeper')}
                </div>
                <ArrowDown color={`var(--color-story-${type})`} />
              </div>
            )}
          </div>
        </div>
        {(goDeeper || type === 'article') && (
          <div>
            {longScrollStory &&
              longScrollStory.contents.modules.map((millerModule, i) => (
                <VisualModule key={i} millerModule={millerModule} />
              ))}
          </div>
        )}
        <div className={`${styles.LeftButtonStory}`}>
          <LangLink
            onClick={() => setGoDeeper(false)}
            to={`/story/${prevSlug}`}
            className={`btn-circle cursor-pointer no-link`}
          >
            <ArrowLeft />
          </LangLink>
        </div>
        <div className={`${styles.RightButtonStory}`}>
          <LangLink
            onClick={() => setGoDeeper(false)}
            to={`/story/${nextSlug}`}
            className={`btn-circle cursor-pointer no-link`}
          >
            <ArrowRight />
          </LangLink>
        </div>
      </div>
    </Layout>
  )
}
