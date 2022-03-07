import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import Layout from '../components/Layout'

export default function Stories() {
  const { type } = useParams()
  const { pathname: basePath } = useResolvedPath('..')
  const navigate = useNavigate()
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
      <h1>Tell Da Story of ma life!</h1>
      <h2>{type}</h2>
    </Layout>
  )
}
