import { useCallback, useMemo, useRef, useState, Fragment } from 'react'
import Player from 'react-player'
import find from 'lodash/find'
import { Pause, Play, SkipForward, Volume1, VolumeX } from 'react-feather'
import { fromProgressStrToSeconds, fromSecondsToProgressStr } from '../../utils'
import MediaProgressLine from '../../components/MediaProgressLine'
import InteractiveGrid from '../../components/InteractiveGrid'

function objInTime(obj, seconds) {
  return (
    seconds >= fromProgressStrToSeconds(obj.from) &&
    seconds <= fromProgressStrToSeconds(obj.to)
  )
}

function getObjImage(obj) {
  return obj.document.data?.resolutions?.preview?.url ?? obj.document.attachment
}

export default function InteractiveVideoStory({ story }) {
  // NOTE: Very bad implementation ... buy u know ...
  const videoChapters = useMemo(
    () => story.data.chapters.slice(0, -1),
    [story.data.chapters]
  )
  const [chapterIndex, setChapterIndex] = useState(0)

  const selectedChapter = videoChapters[chapterIndex]
  const videUrl = selectedChapter.contents.modules[0].object.document.url

  // Playere related hooks
  const playerRef = useRef()
  const [playing, setPlaying] = useState(false)
  const togglePlay = useCallback(() => setPlaying((p) => !p), [])
  const [duration, setDuration] = useState(0)
  const [muted, setMulted] = useState(false)
  const toggleMuted = useCallback(() => setMulted((m) => !m), [])
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  const onPlayerReady = useCallback(() => {
    setDuration(playerRef.current.getDuration())
  }, [])
  const handleSeek = useCallback((index, progress) => {
    setChapterIndex(index)
    playerRef.current.seekTo(progress, 'fraction')
  }, [])
  const goToNextChapter = useCallback(() => {
    if (chapterIndex < videoChapters.length - 1) {
      setProgress({ played: 0, playedSeconds: 0 })
      playerRef.current.seekTo(0, 'fraction')
      setChapterIndex(chapterIndex + 1)
      return true
    }
    return false
  }, [chapterIndex, videoChapters.length])
  const handleOnPlayEnd = useCallback(() => {
    const hasNext = goToNextChapter()
    if (!hasNext) {
      setPlaying(false)
    }
  }, [goToNextChapter])

  // Find stuff related 2 video player time
  const relatedObjs = selectedChapter.contents.modules[0].objects
  const leftObj = useMemo(() => {
    return (
      find(
        relatedObjs,
        (o) => o.tags === 'left' && objInTime(o, progress.playedSeconds)
      ) ?? null
    )
  }, [progress.playedSeconds, relatedObjs])
  const rightObj = useMemo(() => {
    return (
      find(
        relatedObjs,
        (o) => o.tags === 'right' && objInTime(o, progress.playedSeconds)
      ) ?? null
    )
  }, [progress.playedSeconds, relatedObjs])
  console.log(leftObj)

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <InteractiveGrid
        topLeft={
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            Subtitles Here
          </div>
        }
        video={
          <Player
            onEnded={handleOnPlayEnd}
            volume={1}
            muted={muted}
            className="video-player-cover"
            progressInterval={200}
            ref={playerRef}
            onReady={onPlayerReady}
            width="100%"
            height="100%"
            url={videUrl}
            playing={playing}
            onProgress={setProgress}
            playsinline
          />
        }
        bottomLeftImageSource={leftObj ? getObjImage(leftObj) : null}
        bottomLeft={
          leftObj ? (
            <div className="w-100 h-100 d-flex align-items-end">
              <div className="ms-4 mb-4">
                {leftObj.document.data.title}
              </div>
            </div>
          ) : null
        }
        bottomRightImageSource={rightObj ? getObjImage(rightObj) : null}
        bottomRight={
          rightObj ? (
            <div className="w-100 h-100 d-flex align-items-end">
              <div className="ms-4 mb-4">
                {rightObj.document.data.title}
              </div>
            </div>
          ) : null
        }
      />
      <div className="w-100 d-flex bg-white" style={{ height: 64 }}>
        <div className="d-flex align-items-center justify-content-center mx-5">
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
          <SkipForward
            onClick={goToNextChapter}
            className="ms-2 cursor-pointer"
            color="black"
            fill="black"
          />
        </div>
        <div style={{ flex: 1 }} className="d-flex flex-column">
          <div className="w-100 d-flex" style={{ height: 8 }}>
            {videoChapters.map((chapter, i) => (
              <Fragment key={chapter.id}>
                {i !== 0 && (
                  <div className="bg-white h-100" style={{ width: 20 }} />
                )}
                <MediaProgressLine
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
            <span className="text-cadet-blue">
              {fromSecondsToProgressStr(progress.playedSeconds)}
              {'/'}
              {fromSecondsToProgressStr(duration)}
            </span>
            <span className="text-cadet-blue ms-3">
              {selectedChapter.data.title}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center mx-5">
          {muted ? (
            <VolumeX
              className="cursor-pointer"
              onClick={toggleMuted}
              color="black"
              fill="black"
            />
          ) : (
            <Volume1
              className="cursor-pointer"
              onClick={toggleMuted}
              color="black"
              fill="black"
            />
          )}
        </div>
      </div>
    </div>
  )
}
