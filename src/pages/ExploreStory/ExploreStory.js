import { useStoryWithChapters } from '@c2dh/react-miller'
import { useParams } from 'react-router-dom'
import { getStoryType } from '../../utils'
import InteractiveVideoStory from './InteractiveVideoStory'

export default function ExploreStory() {
  const { slug } = useParams()
  const [story] = useStoryWithChapters(slug)
  const type = getStoryType(story)

  const passProps = { story }

  if (type === 'interactive-video') {
    return (
      <InteractiveVideoStory {...passProps} />
    )
  }

  console.warn('Inalid story type', type)

  return null
}
