import { useStories } from '@c2dh/react-miller'
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
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
        <div>
          <input
            onChange={() => {
              navigate(
                `${basePath}/stories/${type === 'voronoi' ? 'list' : 'voronoi'}`
              )
            }}
            type="checkbox"
            checked={type === 'voronoi'}
          />
        </div>
      }
    >
      {type === 'list' && <ListStories stories={storiesList.results} />}
      {type === 'voronoi' && <div>VORONOI HERE</div>}
    </Layout>
  )
}
