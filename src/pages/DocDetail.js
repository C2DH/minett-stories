import { useDocument } from '@c2dh/react-miller'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'

export default function DocDetail() {
  const { slug } = useParams()
  const [doc] = useDocument(slug)

  return (
    <Layout>
      <div>DOC DETAIL: {slug}</div>
      <img height={400} src={doc.attachment} alt={doc.data.title} />
    </Layout>
  )
}
