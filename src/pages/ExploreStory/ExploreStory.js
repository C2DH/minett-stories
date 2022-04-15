import { useStoryWithChapters } from '@c2dh/react-miller'
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

  switch (type) {
    case 'interactive-video':
      return <InteractiveVideoStory {...passProps} />
    case 'video':
      return <VideoStory {...passProps} />
    case 'audio':
      return <AudioStory {...passProps} />
    case 'graphic-novel':
      return <GraphicNovelStory {...passProps} />
    case 'map':
      return <MapStory {...passProps} />
    default:
      console.warn('Inalid story type', type)
      return null
  }
}
