import { useCallback, useMemo, useRef, useState } from 'react'
import Player from 'react-player'
import VisualModule from '../../components/VisualModule'
import ChaptersProgressBar from '../../components/ChaptersProgressBar'
import LangLink from '../../components/LangLink'
import { ArrowLeft } from 'react-feather'

export default function VideoStory({ story }) {
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
        <div className="flex-1" style={{ overflow: 'hidden' }}>
          <LangLink
            style={{
              zIndex: 20,
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
        </div>
        <ChaptersProgressBar
          storyType="video"
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
        <div className="bg-white">
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </>
  )
}
