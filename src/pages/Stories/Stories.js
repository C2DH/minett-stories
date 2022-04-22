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

function StoriesVoronoi({ stories }) {
  const [story, setStory] = useState(null)
  const { pathname: basePath } = useResolvedPath('..')
  const navigate = useNavigate()
  return (
    <div
      className={`h-100 d-flex flex-column padding-top-bar ${styles.Voronoi}`}
    >
      <IntroVoronoi
        withHoverEffect
        stories={stories}
        onStoryHover={setStory}
        onStoryClick={() => navigate(`${basePath}/story/${story.slug}`)}
      />
      <div
        className={classNames(styles.VoronoiHoveredStory, {
          [styles.VoronoiHoveredStoryActive]: story !== null,
        })}
      >
        {story && (
          <>
            <StoryPill type={getStoryType(story)} />
            <h1 className='mt-3'>{story.data.title}</h1>
          </>
        )}
      </div>
    </div>
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

  console.log(type === 'voronoi' ? false : true, type)

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
