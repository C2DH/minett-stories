import { useStory } from '@c2dh/react-miller'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import styles from './Education.module.css'
import socialMediaImage from '../../assets/socialMediaImage.png'

export default function Education() {
  const [story] = useStory('education')
  return (
    <Layout>
      <Helmet defer={false}>
        <title>{`Minett Stories | Education`}</title>
        <meta property="og:image" content={socialMediaImage} />
      </Helmet>
      <div className={`padding-top-bar`}>
        <h1 className={`${styles.Title}`}>{story.data.title}</h1>
        <div className={`${styles.Education}`}>
          <div className={`${styles.EducationInfo}`}>
            <div className={styles.TextEducation}>
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
