import { useStory } from '@c2dh/react-miller'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import styles from './About.module.css'
import unilu from '../../assets/logo_unilu.png'
import esch22 from '../../assets/logo_esch22.png'
import socialMediaImage from '../../assets/socialMediaImage.png'

export default function About() {
  const [story] = useStory('about')
  return (
    <Layout>
      <Helmet defer={false}>
        <title>{`Minett Stories | About`}</title>
        <meta property="og:image" content={socialMediaImage} />
      </Helmet>
      <div className={`padding-top-bar`}>
        <h1 className={`${styles.Title}`}>{story.data.title}</h1>
        <div className={`${styles.About}`}>
          <div className={`${styles.AboutInfo}`}>
            <div className={styles.TextAbout}>
              <ReactMarkdown linkTarget="_blank">
                {story.data.abstract}
              </ReactMarkdown>
            </div>
          </div>
          <div className={styles.LogoCredits}>
            <div className="ps-5 pt-5">
              <a
                href="https://www.uni.lu/"
                rel={'noreferrer'}
                target={'_blank'}
              >
                <img
                  width={300}
                  src={unilu}
                  alt="Unilu"
                  className={`${styles.unilu}`}
                />
              </a>
              <a
                href="https://esch2022.lu/"
                rel={'noreferrer'}
                target={'_blank'}
              >
                <img width={120} className="mt-4" src={esch22} alt="Esch-sur-Alzette European Capital of Culture 2022" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
