import { useState, useCallback, Fragment, useEffect, useRef } from 'react'
import { useDocument, useStory, useStoryWithChapters } from '@c2dh/react-miller'
import Player from 'react-player'
import { Pause, Play, SkipForward } from 'react-feather'
import InteractiveGrid from '../components/InteractiveGrid'
import { fromSecondsToProgressStr } from '../utils'

function ChapterProgressLine({ index, played, onSeek }) {
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

export default function TestInteractiveVideo() {
  const [story3] = useStoryWithChapters('outline-1')

  const [story] = useStory(39)
  const video = story.contents.modules[0].object.document
  const [doc] = useDocument(2)

  console.log('Render!')
  const playerRef = useRef()
  const [playing, setPlaying] = useState(false)
  const togglePlay = useCallback(() => setPlaying((p) => !p), [])
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  console.log(video.url, progress)

  const handleSeek = useCallback((index, progress) => {
    playerRef.current.seekTo(progress, 'fraction')
  }, [])

  const chpaters = [
    {
      id: 1,
      title: 'First Chapter!',
    },
    {
      id: 2,
      title: 'Second Chapter!',
    },
    {
      id: 3,
      title: 'Third Chapter!',
    },
  ]
  const chapterIndex = 0

  // useEffect(() => {
  //   console.log('~', playerRef.current.getDuration())
  // }, [])

  function onPlayerReady(index, played) {
    setDuration(playerRef.current.getDuration())
  }

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <InteractiveGrid
        topLeft={
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            Gio Va
          </div>
        }
        video={
          <Player
            progressInterval={200}
            ref={playerRef}
            onReady={onPlayerReady}
            width="100%"
            height="100%"
            url={video.url}
            playing={playing}
            onProgress={setProgress}
            playsinline
          />
          // <video
          //   src={video.url}

          // />
        }
        // bottomLeftImageSource={doc.attachment}
        // bottomLeftImageSource={null}
        // bottomRightImageSource={doc.attachment}
      />
      <div className="w-100 d-flex bg-white" style={{ height: 64 }}>
        <div
          style={{ width: 172 }}
          className="d-flex align-items-center justify-content-center"
        >
          {playing ? (
            <Pause
              className="cursor-pointer"
              onClick={togglePlay}
              color="black"
              fill="black"
            />
          ) : (
            <Play
              className="cursor-pointer"
              onClick={togglePlay}
              color="black"
              fill="black"
            />
          )}
          <SkipForward className="ms-2" color="black" fill="black" />
        </div>
        <div style={{ flex: 1 }} className="d-flex flex-column">
          <div className="w-100 d-flex" style={{ height: 8 }}>
            {chpaters.map((chapter, i) => (
              <Fragment key={chapter.id}>
                {i !== 0 && (
                  <div className="bg-white h-100" style={{ width: 20 }} />
                )}
                <ChapterProgressLine
                  index={i}
                  onSeek={handleSeek}
                  played={i === chapterIndex ? progress.played : 0}
                />
              </Fragment>
            ))}
          </div>
          <div
            className="w-100 d-flex align-items-center text-cadet-blue"
            style={{ flex: 1 }}
          >
            <span className='text-cadet-blue'>
              {fromSecondsToProgressStr(progress.playedSeconds)}
              {'/'}
              {fromSecondsToProgressStr(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
