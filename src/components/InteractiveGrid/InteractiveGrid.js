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

export default function InteractiveGrid({
  video,
  bottomLeftImageSource,
  bottomLeft,
  bottomRightImageSource,
  bottomRight,
  videoContainerStyle,
  topLeft,
  intialPosition = DEFAULT_INITIAL_POSITION,
  positionBounds = DEFAULT_POSITION_BOUNDS,
  handleRadiusPx = DEFAULT_HANDLE_RADIUS_PX,
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

  const [position, setPosition] = useState(intialPosition)

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
          left: '30%',
          right: 0,
          top: 0,
          bottom: '20%',
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
            backgroundImage: bottomLeftImageSource
              ? `url(${bottomLeftImageSource})`
              : undefined,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
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
            backgroundImage: bottomRightImageSource
              ? `url(${bottomRightImageSource})`
              : undefined,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
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
    </div>
  )
}
