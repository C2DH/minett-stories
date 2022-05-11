import { useStoryWithChapters } from '@c2dh/react-miller'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { getStoryType } from '../../utils'
import AudioStory from './AudioStory'
import GraphicNovelStory from './GraphicNovelStory'
import InteractiveVideoStory from './InteractiveVideoStory'
import MapStory from './MapStory'
import VideoStory from './VideoStory'

export default function ExploreStory() {
  const { slug } = useParams()
  const [story] = useStoryWithChapters(slug)
  const type = getStoryType(story)

  const passProps = { story }

  let element
  switch (type) {
    case 'interactive-video':
      element = <InteractiveVideoStory {...passProps} />
      break
    case 'interactive-audio':
      element = <InteractiveVideoStory {...passProps} />
      break
    case 'video':
      element = <VideoStory {...passProps} />
      break
    case 'audio':
      element = <AudioStory {...passProps} />
      break
    case 'graphic-novel':
      element = <GraphicNovelStory {...passProps} />
      break
    case 'map':
      element = <MapStory {...passProps} />
      break
    default:
      console.warn('Inalid story type', type)
      element = null
      break
  }

  const coverImage =
    story.covers?.[0]?.data?.resolutions?.preview?.url ??
    story.covers?.[0]?.attachment
  return (
    <>
      <Helmet defer={false}>
        <title>{`Minett Stories | Explore ${story.data.title}`}</title>
        <meta property="og:image" content={coverImage} />
      </Helmet>
      {element}
    </>
  )
}
