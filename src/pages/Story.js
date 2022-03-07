import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'

export default function Story() {
  const { slug } = useParams()
  return (
    <Layout>
      <div>STORY: {slug}</div>
    </Layout>
  )
}
