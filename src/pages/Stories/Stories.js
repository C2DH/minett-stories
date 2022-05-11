import { usePrefetchStoryWithChapters, useStories } from '@c2dh/react-miller'
import { useCrawl } from 'snext/crawl'
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import { FormGroup, Input, Label } from 'reactstrap'
import { Helmet } from 'react-helmet'
import Layout from '../../components/Layout'
import ListStories from '../../components/ListStories/ListStories'
import IntroVoronoi from '../../components/IntroVoronoi'
import styles from './Stories.module.css'
import classNames from 'classnames'
import { useState } from 'react'
import StoryPill from '../../components/StoryPill'
import { getStoryType } from '../../utils'
import { useIsMobileScreen } from '../../hooks/screen'
import LangLink from '../../components/LangLink'
import { useTranslation } from 'react-i18next'

function StoriesVoronoi({ stories }) {
  const [selectedStory, setSelectedStory] = useState(null)
  const { pathname: basePath } = useResolvedPath('..')
  const navigate = useNavigate()

  const isMobileScreen = useIsMobileScreen()

  const { t } = useTranslation()

  const prefetchStoryWithChapters = usePrefetchStoryWithChapters()

  return (
    <>
      <div className={classNames(`d-flex flex-column ${styles.Voronoi}`)}>
        <Helmet defer={false}>
          <title>{`Minett Stories | Stories`}</title>
        </Helmet>
        <IntroVoronoi
          stories={stories}
          withHoverEffect={!isMobileScreen}
          onStoryHover={isMobileScreen ? undefined : setSelectedStory}
          onStoryClick={(story) => {
            if (isMobileScreen) {
              setSelectedStory(story)
            } else {
              navigate(`${basePath}/story/${story.slug}`)
              prefetchStoryWithChapters(story.slug)
            }
          }}
        />
        <div className={styles.Instructions}>{t('interact_label')}</div>
        <div
          className={classNames(styles.VoronoiSelectedStory, {
            [styles.VoronoiSelectedStoryActive]: selectedStory !== null,
          })}
        >
          {selectedStory && (
            <>
              <StoryPill type={getStoryType(selectedStory)} />
              <h1 className={`${styles.TitleStory} mt-3`}>
                {selectedStory.data.title}
              </h1>
              <div className={`${styles.ResearchBy} text-cadet-blue`}>
                {t('research_by')}:{' '}
                {selectedStory.authors.map((a) => a.fullname).join(', ')}
              </div>
              <LangLink
                onClick={() => {
                  prefetchStoryWithChapters(selectedStory.slug)
                }}
                className={`${styles.ButtonOpen} btn text-white pt-2 pb-2 rounded-pill bg-dark-gray w-100`}
                to={`/story/${selectedStory.slug}`}
              >
                {t('open')}
              </LangLink>
            </>
          )}
        </div>
      </div>
      {selectedStory && isMobileScreen && (
        <div className={styles.VoronoiMobileBottomPadder} />
      )}
    </>
  )
}

export default function Stories() {
  const { type } = useParams()
  const { pathname: basePath } = useResolvedPath('..')
  const navigate = useNavigate()

  const { t } = useTranslation()

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

  useCrawl([
    `${basePath}/stories/list`,
    `${basePath}/archive`,
    `${basePath}/archive/filter`,
    `${basePath}/about`,
  ])

  return (
    <Layout
      right={
        <div className="d-flex align-items-center">
          <div className="d-none d-md-inline-block me-2 top-switch-stories">
            {t('mix_view')}
          </div>
          {/* NOTE: avoid switch for now see https://github.com/reactstrap/reactstrap/issues/2415 */}
          <FormGroup className={'ms-0 form-switch mt-4'}>
            <Input
              id="switch"
              className="switch-input cursor-pointer"
              checked={type === 'voronoi' ? false : true}
              onChange={() => {
                navigate(
                  `${basePath}/stories/${
                    type === 'voronoi' ? 'list' : 'voronoi'
                  }`
                )
              }}
              type="switch"
            />

            <Label
              for="switch"
              className="ms-2 text-white top-switch-stories d-none d-md-inline-block"
            >
              {t('list_view')}
            </Label>
          </FormGroup>
        </div>
      }
    >
      {type === 'list' && <ListStories stories={storiesList.results} />}
      {type === 'voronoi' && <StoriesVoronoi stories={storiesList.results} />}
    </Layout>
  )
}
