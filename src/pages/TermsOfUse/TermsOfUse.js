import { useStory } from '@c2dh/react-miller'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import styles from './TermsOfUse.module.css'

export default function About() {
  const [story] = useStory('terms-of-use')
  return (
    <Layout>
      <div className="container-fluid padding-top-bar">
        <div className="row">
          <div className="col-md-8">
            <h1>{story.data.title}</h1>
            <div className={styles.TextAbout}>
              <ReactMarkdown linkTarget="_blank">
                {story.data.abstract}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
