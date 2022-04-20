import { useStories } from '@c2dh/react-miller'
import { useCrawl } from 'snext/crawl'
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import { FormGroup, Input, Label } from 'reactstrap'
import Layout from '../components/Layout'
import ListStories from '../components/ListStories/ListStories'
import IntroVoronoi from '../components/IntroVoronoi'

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
      exclude : {
        tags__slug__in: ['intro'],
      }
    },
  })

  useCrawl([
    `${basePath}/stories/list`,
    `${basePath}/archive`,
    `${basePath}/archive/filter`,
    `${basePath}/about`,
  ])
  console.log(type === 'voronoi' ? false : true, type)

  return (
    <Layout
      right={
        <div className="d-flex align-items-center">
          <div className="d-none d-md-inline-block me-2 top-switch-stories">Mix view</div>
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

            <Label for="switch" className="ms-2 text-white top-switch-stories d-none d-md-inline-block">
              List View
            </Label>
          </FormGroup>
        </div>
      }
    >
      {type === 'list' && <ListStories stories={storiesList.results} />}
      {type === 'voronoi' && <div className="h-100 d-flex flex-column padding-top-bar"><IntroVoronoi stories={storiesList.results}/></div>}
    </Layout>
  )
}
