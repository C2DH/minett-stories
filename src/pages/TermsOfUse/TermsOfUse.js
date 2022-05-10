import { useStory } from '@c2dh/react-miller'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import styles from './TermsOfUse.module.css'

export default function TermsOfUse() {
  const [story] = useStory('terms-of-use')
  return (
    <Layout>
      <Helmet defer={false}>
        <title>{`Minett Stories | Terms of use`}</title>
      </Helmet>
      <div className={`padding-top-bar`}>
        <h1 className={`${styles.Title}`}>{story.data.title}</h1>
        <div className={`${styles.TermsOfUse}`}>
          <div className={`${styles.TermsOfUseInfo}`}>
            <div className={styles.TextTermsOfUse}>
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
