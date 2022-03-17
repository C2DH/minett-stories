import { useDocument, useStory } from '@c2dh/react-miller'
import { DraggableCore } from 'react-draggable'
import { useState } from 'react'

const HANDLE_R = 40

export default function TestInteractiveVideo() {
  const [story] = useStory(39)
  console.log('Story', story)

  const video = story.contents.modules[0].object.document
  // const doc = story.contents.modules[0].objects[0].document

  const [doc] = useDocument(2)
  console.log({ video, doc })

  const [height, setHeight] = useState(30)
  const [width, setWidth] = useState(60)

  function handleDrag(e, data) {
    // TODO: Use container ref
    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight

    const width = (data.x * 100) / WIDTH
    const height = 100 - (data.y * 100) / HEIGHT
    // console.log('D', e, data)
    console.log('W', width, data.x, WIDTH)
    setWidth(width)
    setHeight(height)
  }

  return (
    <div className="h-100 w-100" style={{ position: 'relative' }}>
      <div style={{ zIndex: 999, position: 'fixed', left: 0 }}>
        <button onClick={() => setHeight((a) => a - 10)}>-</button>
        <button onClick={() => setHeight((a) => a + 10)}>+</button>
        {height} H
        <br />
        <br />
        <button onClick={() => setWidth((a) => a - 10)}>-</button>
        <button onClick={() => setWidth((a) => a + 10)}>+</button>
        {width} W
      </div>

      <div
        className="border d-flex justify-content-center align-items-center"
        style={{
          zIndex: 1,
          position: 'absolute',
          left: '30%',
          right: 0,
          top: 0,
          bottom: '20%',
        }}
      >
        <video
          src={video.url}
          controls
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        />
      </div>

      <div
        className="border"
        style={{
          overflow: 'hidden',
          zIndex: 2,
          position: 'absolute',
          height: `${height}%`,
          width: `${width}%`,
          left: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            minHeight: '70vh',
            minWidth: '60vw',
            height: '100%',
            backgroundPosition: 'top right',
            backgroundImage: `url(${doc.attachment})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <div
        className="bg-danger"
        style={{
          zIndex: 3,
          position: 'absolute',
          left: 0,
          width: `${width}%`,
          top: 0,
          height: `${100 - height}%`,
        }}
      />
      <div
        className="bg-primary"
        style={{
          zIndex: 3,
          position: 'absolute',
          width: `${100 - width}%`,
          height: `${height}%`,
          right: 0,
          bottom: 0,
        }}
      />

      <DraggableCore handle=".handle" onDrag={handleDrag}>
        <div
          className="handle"
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            borderRadius: '50%',
            zIndex: 99,
            top: `calc(${100 - height}% - ${HANDLE_R / 2}px)`,
            left: `calc(${width}% - ${HANDLE_R / 2}px)`,
            right: 0,
            width: HANDLE_R,
            height: HANDLE_R,
          }}
        />
      </DraggableCore>
    </div>
  )
}
