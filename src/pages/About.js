import { useStory } from '@c2dh/react-miller'
import ReactMarkdown from 'react-markdown'
import Layout from '../components/Layout'

export default function About() {
  const [story] = useStory('about')

  return (
    <Layout>
      <div className="container-fluid padding-top-bar">
        <h1>{story.data.title}</h1>
        <ReactMarkdown linkTarget="_blank">{story.data.abstract}</ReactMarkdown>
      </div>
    </Layout>
  )
}
