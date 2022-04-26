import { useStories } from '@c2dh/react-miller'
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import { FormGroup, Input, Label } from 'reactstrap'
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

function StoriesVoronoi({ stories }) {
  const [selectedStory, setSelectedStory] = useState(null)
  const { pathname: basePath } = useResolvedPath('..')
  const navigate = useNavigate()

  const isMobileScreen = useIsMobileScreen()

  return (
    <>
      <div className={classNames(`d-flex flex-column ${styles.Voronoi}`)}>
        <IntroVoronoi
          stories={stories}
          withHoverEffect={!isMobileScreen}
          onStoryHover={isMobileScreen ? undefined : setSelectedStory}
          onStoryClick={(story) => {
            if (isMobileScreen) {
              setSelectedStory(story)
            } else {
              navigate(`${basePath}/story/${story.slug}`)
            }
          }}
        />
        <div
          className={classNames(styles.VoronoiSelectedStory, {
            [styles.VoronoiSelectedStoryActive]: selectedStory !== null,
          })}
        >
          {selectedStory && (
            <>
              <StoryPill type={getStoryType(selectedStory)} />
              <h1 className="mt-3">{selectedStory.data.title}</h1>
              <LangLink
                className="btn text-white rounded-pill btn-dark w-100"
                to={`/story/${selectedStory.slug}`}
              >
                Open
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

  return (
    <Layout
      right={
        <div className="d-flex align-items-center">
          <div className="d-none d-md-inline-block me-2 top-switch-stories">
            Mix view
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
              List View
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