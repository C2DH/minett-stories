import { useCallback, useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut } from 'react-feather'
import ReactHammer from 'react-hammerjs'
import Hammer from 'hammerjs'
import styles from './ZoomAndPanMedia.module.css'

const PINCH_TIMEOUT = 300

export default function ZoomAndPanMediaNew({ src, isModal }) {
  const [state, setState] = useState({
    zoom: 1,
    pinchingZoom: 1,
    lastPinchedAt: 0,
    deltaX: 0,
    deltaY: 0,
    panDeltaX: 0,
    panDeltaY: 0,
    maxWidth: 0,
    maxHeight: 0,
  })

  const mediaContentRef = useRef()

  const boundsDeltas = useCallback(
    (deltaX, deltaY, zoom) => {
      const maxDeltaX = (state.maxWidth * (+zoom - 1)) / 2
      const maxDeltaY = (state.maxHeight * (+zoom - 1)) / 2

      const boundedDeltaX = Math.max(Math.min(deltaX, maxDeltaX), -maxDeltaX)
      const boundedDeltaY = Math.max(Math.min(deltaY, maxDeltaY), -maxDeltaY)

      return {
        deltaX: boundedDeltaX,
        deltaY: boundedDeltaY,
      }
    },
    [state.maxHeight, state.maxWidth]
  )

  function getTransform() {
    const translateDeltaX = state.deltaX + state.panDeltaX
    const translateDeltaY = state.deltaY + state.panDeltaY
    const scale = state.zoom * state.pinchingZoom
    return `translate(${translateDeltaX}px, ${translateDeltaY}px) scale(${scale})`
  }

  const handleZoom = useCallback(
    (param) => {
      const nextZoom =
        param + state.zoom > 4 || param + state.zoom < 1
          ? state.zoom
          : param + state.zoom
      setState({
        ...state,
        pinchingZoom: 1,
        zoom: nextZoom,
        ...boundsDeltas(state.deltaX, state.deltaY, nextZoom),
      })
    },
    [boundsDeltas, state]
  )

  function handlePinchEnd(e) {
    let newZoom = state.zoom * e.scale
    newZoom = Math.max(Math.min(newZoom, 4), 1)
    setState({
      ...state,
      pinchingZoom: 1,
      lastPinchedAt: new Date().getTime(),
      zoom: newZoom,
      ...boundsDeltas(state.deltaX, state.deltaY, newZoom),
    })
  }

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault()
      handleZoom(e.deltaY * -0.01)
    },
    [handleZoom]
  )

  function resetZoom() {
    const zoom = 1
    setState({
      ...state,
      pinchingZoom: 1,
      zoom,
      ...boundsDeltas(state.deltaX, state.deltaY, zoom),
    })
  }

  function handlePinch(e) {
    const pinchingZoom = +e.scale
    setState({
      ...state,
      pinchingZoom,
    })
  }

  function handlePan(e) {
    if (
      state.pinchingZoom !== 1 ||
      new Date().getTime() - state.lastPinchedAt < PINCH_TIMEOUT
    ) {
      return
    }
    setState({
      ...state,
      panDeltaX: +e.deltaX,
      panDeltaY: +e.deltaY,
    })
  }

  function handlePanEnd(e) {
    if (
      state.pinchingZoom !== 1 ||
      new Date().getTime() - state.lastPinchedAt < PINCH_TIMEOUT
    ) {
      return
    }

    let deltaX = +e.deltaX + state.deltaX
    let deltaY = +e.deltaY + state.deltaY

    setState({
      ...state,
      panDeltaX: 0,
      panDeltaY: 0,
      ...boundsDeltas(deltaX, deltaY, state.zoom * state.pinchingZoom),
    })
  }

  function onLoadImage(e) {
    setState({
      ...state,
      maxWidth: e.target.width,
      maxHeight: e.target.height,
    })
  }

  useEffect(() => {
    const image = mediaContentRef.current
    image.addEventListener('wheel', (e) => handleWheel(e), {
      passive: false,
    })
    return () => image.removeEventListener('wheel', (e) => handleWheel(e))
  },[handleWheel])

  return (
    <>
      <div className={styles.ZoomAndPanMedia}>
        <div className={styles.ZoomAndPanMediaContainer} ref={mediaContentRef}>
          <ReactHammer
            options={{
              recognizers: {
                pan: {
                  enable: true,
                  direction: Hammer.DIRECTION_ALL,
                },
                pinch: {
                  enable: true,
                },
              },
            }}
            onPinch={(e) => {
              handlePinch(e)
            }}
            onPinchEnd={(e) => {
              handlePinchEnd(e)
            }}
            onPan={(e) => {
              handlePan(e)
            }}
            onPanEnd={(e) => {
              handlePanEnd(e)
            }}
          >
            <img
              alt="Zoom and pan"
              onDragStart={(e) => {
                e.preventDefault()
                return false
              }}
              onLoad={(e) => onLoadImage(e)}
              draggable="false"
              style={{ transform: getTransform() }}
              className={styles.Zoomable}
              src={src}
            />
          </ReactHammer>
        </div>
      </div>
      <div
        className={
          isModal
            ? styles.ZoomAndPanMediaControlsModal
            : styles.ZoomAndPanMediaControls
        }
      >
        <div className="d-flex flex-row">
          <div
            className={`${styles.ZoomButton} cursor-pointer btn-zoom mb-2`}
            onClick={() => handleZoom(0.1)}
          >
            <ZoomIn></ZoomIn>
          </div>
          <div
            className={`${styles.ZoomResetButton} cursor-pointer btn-zoom mb-2 ms-3`}
            onClick={() => resetZoom()}
          >
            Reset
          </div>
          <div
            className={`${styles.ZoomButton} cursor-pointer btn-zoom mb-2 ms-3`}
            onClick={() => handleZoom(-0.1)}
          >
            <ZoomOut></ZoomOut>
          </div>
        </div>
      </div>
    </>
  )
}
