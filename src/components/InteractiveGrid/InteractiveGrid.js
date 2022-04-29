import { useRef, useState } from 'react'
import { DraggableCore } from 'react-draggable'

const DEFAULT_INITIAL_POSITION = {
  left: 60,
  top: 60,
}

const DEFAULT_POSITION_BOUNDS = {
  maxLeft: 65,
  minLeft: 33,
  maxTop: 72,
  minTop: 35,
}

const DEFAULT_HANDLE_RADIUS_PX = 40

function getDocImageSource(doc) {
  if (!doc) {
    return null
  }
  return doc.data?.resolutions?.preview?.url ?? doc.attachment
}

function getDocVideoSource(doc) {
  if (!doc) {
    return null
  }
  return doc.data?.streamingUrl
}

function BottomLeftDoc({ doc }) {
  if (!doc || doc.type === 'image') {
    const imageSource = getDocImageSource(doc)
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          minHeight: '70vh',
          minWidth: '70vw',
          height: '100%',
          backgroundPosition: 'top right',
          backgroundColor: 'var(--brick)',
          backgroundImage: imageSource ? `url(${imageSource})` : undefined,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
    )
  } else if (doc?.type === 'video') {
    const videoSource = getDocVideoSource(doc)
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '70vw',
          height: '60vh',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'var(--brick)',
          }}
        >
          <video
            muted
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={videoSource}
          />
        </div>
      </div>
    )
  }
  return null
}

function BottomRightDoc({ doc }) {
  if (!doc || doc.type === 'image') {
    const imageSource = getDocImageSource(doc)
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          minHeight: '70vh',
          minWidth: '70vw',
          maxWidth: '100%',
          height: '100%',
          backgroundPosition: 'top left',
          backgroundColor: 'var(--green)',
          backgroundImage: imageSource
            ? `url(${imageSource})`
            : undefined,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
    )
  } else if (doc?.type === 'video') {
    const videoSource = getDocVideoSource(doc)
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '70vw',
          height: '60vh',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'var(--green)',
          }}
        >
          <video
            muted
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={videoSource}
          />
        </div>
      </div>
    )
  }
}

export default function InteractiveGrid({
  video,
  bottomLeftDoc,
  bottomLeft,
  bottomRightDoc,
  bottomRight,
  videoContainerStyle,
  topLeft,
  intialPosition = DEFAULT_INITIAL_POSITION,
  positionBounds = DEFAULT_POSITION_BOUNDS,
  handleRadiusPx = DEFAULT_HANDLE_RADIUS_PX,
  disableDrag = false,
  position: controlledPosition,
}) {
  const containerRef = useRef()

  function handleDrag(_, data) {
    const cotaniner = containerRef.current
    const { width, height } = cotaniner.getBoundingClientRect()
    const left = Math.max(
      Math.min((data.x * 100) / width, positionBounds.maxLeft),
      positionBounds.minLeft
    )
    const top = Math.max(
      Math.min((data.y * 100) / height, positionBounds.maxTop),
      positionBounds.minTop
    )
    setPosition({ left, top })
  }

  const [localPosition, setPosition] = useState(intialPosition)
  const position = controlledPosition ?? localPosition

  return (
    <div
      className="w-100 h-100"
      style={{ position: 'relative' }}
      ref={containerRef}
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          zIndex: 1,
          position: 'absolute',
          left: topLeft ? '30%' : 0,
          right: 0,
          top: 0,
          bottom: controlledPosition
            ? `${100 - controlledPosition.top}%`
            : '20%',
          ...videoContainerStyle,
        }}
      >
        {video}
      </div>
      <div
        style={{
          overflow: 'hidden',
          zIndex: 2,
          position: 'absolute',
          height: `${100 - position.top}%`,
          width: `${position.left}%`,
          left: 0,
          bottom: 0,
        }}
      >
        <BottomLeftDoc doc={bottomLeftDoc} />
        {bottomLeft && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              left: 0,
            }}
          >
            {bottomLeft}
          </div>
        )}
      </div>

      {topLeft && (
        <div
          style={{
            backgroundColor: 'var(--black)',
            zIndex: 3,
            position: 'absolute',
            left: 0,
            width: `${position.left}%`,
            top: 0,
            height: `${position.top}%`,
          }}
        >
          {topLeft}
        </div>
      )}

      <div
        style={{
          zIndex: 3,
          overflow: 'hidden',
          position: 'absolute',
          width: `${100 - position.left}%`,
          height: `${100 - position.top}%`,
          right: 0,
          bottom: 0,
        }}
      >
        <BottomRightDoc doc={bottomRightDoc} />
        {bottomRight && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              left: 0,
            }}
          >
            {bottomRight}
          </div>
        )}
      </div>

      {!disableDrag && (
        <DraggableCore handle=".handle" onDrag={handleDrag}>
          <div
            className={'handle'}
            style={{
              cursor: 'move',
              backgroundColor: 'white',
              position: 'absolute',
              borderRadius: '50%',
              zIndex: 4,
              top: `calc(${position.top}% - ${handleRadiusPx / 2}px)`,
              left: `calc(${position.left}% - ${handleRadiusPx / 2}px)`,
              right: 0,
              width: handleRadiusPx,
              height: handleRadiusPx,
            }}
          />
        </DraggableCore>
      )}
    </div>
  )
}
