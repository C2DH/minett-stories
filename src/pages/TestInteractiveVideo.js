import { useDocument, useStory } from '@c2dh/react-miller'
import InteractiveGrid from '../components/InteractiveGrid'

export default function TestInteractiveVideo() {
  const [story] = useStory(39)
  const video = story.contents.modules[0].object.document
  const [doc] = useDocument(2)

  console.log('Render!')

  return (
    <InteractiveGrid
      topLeft={
        <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
          Gio Va
        </div>
      }
      video={
        <video
          src={video.url}
          controls
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        />
      }
      // bottomLeftImageSource={doc.attachment}
      // bottomLeftImageSource={null}
      // bottomRightImageSource={doc.attachment}
    />
  )
}
