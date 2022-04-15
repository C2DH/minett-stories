import { useCallback, useMemo, useRef, useState } from 'react'
import Player from 'react-player'
import find from 'lodash/find'
import { fromProgressStrToSeconds } from '../../utils'
import InteractiveGrid from '../../components/InteractiveGrid'
import LangLink from '../../components/LangLink'
import DocLink from '../../components/DocLink'
import VisualModule from '../../components/VisualModule'
import ChaptersProgressBar from '../../components/ChaptersProgressBar'
import { ArrowLeft } from 'react-feather'

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
  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]
  const [chapterIndex, setChapterIndex] = useState(0)

  const selectedChapter = videoChapters[chapterIndex]
  const selectedDoc = selectedChapter.contents.modules[0].object.document
  const videUrl = selectedDoc?.data?.streamingUrl ?? selectedDoc.url

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

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

  return (
    <>
      <div className="w-100 h-100 d-flex flex-column">
        <InteractiveGrid
          topLeft={
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <LangLink
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  backgroundColor: 'var(--dark-grey)',
                }}
                to={`/story/${story.slug}`}
                className={'btn-circle cursor-pointer no-link'}
              >
                <ArrowLeft />
              </LangLink>
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
                <DocLink
                  onClick={() => setPlaying(false)}
                  slugOrId={leftObj.document.slug}
                  className="ms-4 mb-4 no-link"
                >
                  {leftObj.document.data.title}
                </DocLink>
              </div>
            ) : null
          }
          bottomRightImageSource={rightObj ? getObjImage(rightObj) : null}
          bottomRight={
            rightObj ? (
              <div className="w-100 h-100 d-flex align-items-end">
                <DocLink
                  slugOrId={rightObj.document.slug}
                  onClick={() => setPlaying(false)}
                  className="ms-4 mb-4 no-link"
                >
                  {rightObj.document.data.title}
                </DocLink>
              </div>
            ) : null
          }
        />
        <ChaptersProgressBar
          storyType="interactive-video"
          played={progress.played}
          playedSeconds={progress.playedSeconds}
          playing={playing}
          onSeek={handleSeek}
          togglePlay={togglePlay}
          duration={duration}
          chapters={videoChapters}
          index={chapterIndex}
          goToNextChapter={goToNextChapter}
          muted={muted}
          toggleMuted={toggleMuted}
          goDeeper={goDeeper}
          onGoDeeper={onGoDeeper}
        />
      </div>
      {goDeeper && (
        <div className="bg-white  ps-3 pe-3 ps-md-0 pe-md-0">
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </>
  )
}
