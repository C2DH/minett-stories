import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'

export default function DocDetail() {
  const { slug } = useParams()
  return (
    <Layout>
      <div>DOC DETAIL: {slug}</div>
    </Layout>
  )
}
