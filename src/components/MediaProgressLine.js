import { memo, useRef } from 'react'

function MediaProgressLine({ index, played, onSeek }) {
  const containerRef = useRef()

  function handleClick(e) {
    const clientX = e.clientX
    const { left, width } = containerRef.current.getBoundingClientRect()
    const nextProgress = Math.min(
      Math.max(clientX - parseInt(left), 0) / width,
      1
    )
    onSeek(index, nextProgress)
  }
  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="w-100 h-100 d-flex cursor-pointer"
      style={{ backgroundColor: 'var(--orange-opacity)' }}
    >
      <div
        style={{
          width: `${(played * 100).toFixed(4)}%`,
          backgroundColor: 'var(--orange)',
        }}
      />
    </div>
  )
}

export default memo(MediaProgressLine)
