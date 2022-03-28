import { useStories } from '@c2dh/react-miller'
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import { FormGroup, Input, Label } from 'reactstrap'
import Layout from '../components/Layout'
import ListStories from '../components/ListStories/ListStories'

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
    },
  })

  return (
    <Layout
      right={
        <div className='d-flex'>
          <div className="d-inline-block me-2 top-switch-stories">Mix view</div>
          <FormGroup className={'ms-0 '} switch={true}>
            <Input
              id="switch"
              className='switch-input'
              onChange={() => {
                navigate(
                  `${basePath}/stories/${
                    type === 'voronoi' ? 'list' : 'voronoi'
                  }`
                )
              }}
              // checked={type === 'voronoi'}
              type="switch"
            />

            <Label for="switch" className="ms-2 text-white top-switch-stories">
              List View
            </Label>
          </FormGroup>
        </div>
      }
    >
      {type === 'list' && <ListStories stories={storiesList.results} />}
      {type === 'voronoi' && <div>VORONOI HERE</div>}
    </Layout>
  )
}
