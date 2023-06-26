import { useStory } from '@c2dh/react-miller'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import styles from './Education.module.css'
import socialMediaImage from '../../assets/socialMediaImage.png'
import vimeo from 'react-player'
import VimeoPlayer from 'react-player/vimeo'

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
              <ReactMarkdown
                linkTarget="_blank"
                components={{
                  p({ node, inline, className, children, ...props }) {
                    // if one of the chimldren is of tagName 'a' and has href containing vimeo.com
                    if (
                      children.length === 1 &&
                      typeof children[0] === 'object'
                    ) {
                      const href = children[0].props?.href
                      if (href && href.indexOf('https://vimeo.com') !== -1) {
                        return (
                          <div
                            style={{
                              padding: '56.25% 0 0 0',
                              position: 'relative',
                              backgroundColor: 'var(--brick)',
                            }}
                            className="position-relative mb-3"
                          >
                            <div className="position-absolute w-100 h-100 top-0">
                              {children}
                            </div>
                          </div>
                        )
                      }
                    }

                    //   return (
                    //     <VimeoPlayer
                    //       playsinline
                    //       playing={false}
                    //       controls
                    //       url={props.href}
                    //     />
                    //   )
                    // }

                    return (
                      <p {...props} className={className}>
                        {children}
                      </p>
                    )
                  },

                  a({ node, inline, className, children, ...props }) {
                    // if href co,ntains vimeo.com
                    if (props.href.indexOf('https://vimeo.com') !== -1) {
                      return (
                        <VimeoPlayer
                          playsinline
                          playing={false}
                          controls
                          url={props.href}
                          width={'100%'}
                          height={'100%'}
                        />
                      )
                    }

                    return (
                      <a {...props} className={className}>
                        {children}
                      </a>
                    )
                  },
                }}
              >
                {story.data.abstract}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
