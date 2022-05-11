import { useStory } from '@c2dh/react-miller'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import styles from './Education.module.css'
import socialMediaImage from '../../assets/socialMediaImage.png'

export default function About() {
  const [story] = useStory('education')
  return (
    <Layout>
      <Helmet defer={false}>
        <title>{`Minett Stories | Education`}</title>
        <meta property="og:image" content={socialMediaImage} />
      </Helmet>
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
