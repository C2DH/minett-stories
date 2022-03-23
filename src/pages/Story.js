import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { useStory } from '@c2dh/react-miller'
import VisualModule from '../components/VisualModule'

export default function Story() {
  const { slug } = useParams()
  const [story] = useStory(slug)

  return (
    <Layout>
      <div>STORY: {slug}</div>
      <div className="container-fluid" style={{ maxWidth: 800 }}>
        {/* {story.contents.modules.map((millerModule, i) => (
          <VisualModule key={i} millerModule={millerModule} />
        ))} */}
      </div>
    </Layout>
  )
}
