import { useCallback, useMemo, useRef, useState } from 'react'
import find from 'lodash/find'
import Player from 'react-player'
import { ArrowLeft, Maximize } from 'react-feather'
import { useNavigationType } from 'react-router-dom'
import styles from './VideoStory.module.css'
import LangLink from '../../../components/LangLink'
import { getStoryType } from '../../../utils'
import ChaptersProgressBar from '../../../components/ChaptersProgressBar'
import StoryPill from '../../../components/StoryPill'
import LongScrollStory from '../../../components/LongScrollStory'
import { useTranslation } from 'react-i18next'

export default function VideoStory({ story }) {
  // NOTE: Very bad implementation ... buy u know ...
  const videoChapters = useMemo(
    () => story.data.chapters.slice(0, -1),
    [story.data.chapters]
  )
  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]
  const [chapterIndex, setChapterIndex] = useState(0)

  const selectedChapter = videoChapters[chapterIndex]
  const selectedDoc = selectedChapter.contents.modules[0].document
  const videoUrl = selectedDoc?.data?.streamingUrl ?? selectedDoc.url

  // Playere related hooks
  const playerRef = useRef()
  // NOTE: Not 100% correct but Y know ... When coming from push state auto play stuff
  const navigationType = useNavigationType()
  const [playing, setPlaying] = useState(navigationType === 'PUSH')
  const togglePlay = useCallback(() => setPlaying((p) => !p), [])
  const [duration, setDuration] = useState(0)
  const [muted, setMulted] = useState(false)
  const toggleMuted = useCallback(() => setMulted((m) => !m), [])
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  const [subtitles, setSubtitles] = useState([])
  const handleCueChange = useCallback((e) => {
    const nextSubtitles = Array.from(e.target.activeCues).map((cue) => cue.text)
    setSubtitles(nextSubtitles)
  }, [])
  const trackRef = useRef(null)
  const playerInitRef = useRef(false)
  const onPlayerReady = useCallback(() => {
    if (playerInitRef.current) {
      return
    }
    setDuration(playerRef.current.getDuration())
    if (progress.played > 0) {
      playerRef.current.seekTo(progress.played, 'fraction')
    }
    if (trackRef.current) {
      trackRef.current.removeEventListener('cuechange', handleCueChange)
    }
    const video = playerRef.current.getInternalPlayer()
    const track = video.textTracks[0]
    if (track) {
      track.addEventListener('cuechange', handleCueChange)
      trackRef.current = track
    }
    playerInitRef.current = true
  }, [handleCueChange, progress.played])
  const handleSeek = useCallback(
    (index, progress) => {
      setChapterIndex(index)
      setProgress((prev) => ({
        played: progress,
        // NOTE: Keep prev value too avoid flikr
        playedSeconds: prev.playedSeconds,
        // playedSeconds: null, // Will auto set by my player
      }))
      playerRef.current.seekTo(progress, 'fraction')
      if (index !== chapterIndex) {
        playerInitRef.current = false
      }
    },
    [chapterIndex]
  )
  const goToNextChapter = useCallback(() => {
    if (chapterIndex < videoChapters.length - 1) {
      setProgress({ played: 0, playedSeconds: 0 })
      playerRef.current.seekTo(0, 'fraction')
      setChapterIndex(chapterIndex + 1)
      playerInitRef.current = false
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

  const type = getStoryType(story)

  const { i18n } = useTranslation()

  // NOTE: Grab subtitles in current language
  const subtitlesFile = useMemo(() => {
    return (
      find(selectedDoc?.data?.subtitles ?? [], {
        language: i18n.language,
        availability: true,
        type: 'vtt',
      })?.url ?? null
    )
  }, [i18n.language, selectedDoc?.data?.subtitles])

  const tracks = useMemo(() => {
    if (!subtitlesFile) {
      return []
    }
    return [
      {
        kind: 'metadata',
        src: subtitlesFile,
        default: true,
      },
    ]
  }, [subtitlesFile])

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
            url={videoUrl}
            playing={playing}
            onProgress={setProgress}
            playsinline
            config={{
              file: { tracks },
            }}
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
          actions={
            <div className="me-3 cursor-pointer text-black">
              <Maximize
                onClick={() => {
                  if (!process.env.IS_SNEXT_SERVER) {
                    import('screenfull').then(({ default: screenfull }) => {
                      if (screenfull.isEnabled) {
                        const video = playerRef.current.getInternalPlayer()
                        screenfull.request(video)
                      }
                    })
                  }
                }}
                color="var(--black)"
              />
            </div>
          }
        />
      </div>
      {goDeeper && (
        <div className={styles.Content}>
          <div className="row pt-4 text-black bg-white">
            <div className="offset-gigaxl-4 col-gigaxl-4 col-md-6 offset-md-3 d-flex flex-column align-items-start">
              <StoryPill type={type} />
              <h1 className={`${styles.TitleStory} m-0 p-0 mt-3`}>
                {story.data.title}
              </h1>
              <div className={`${styles.ResearchText} text-cadet-blue mt-3`}>
                {story.authors.map((a) => a.fullname).join(', ')}
              </div>
              <p className={`${styles.AbstractText} mt-3`}>
                {story.data.abstract}
              </p>
            </div>
          </div>
          <div className="bg-white">
            <LongScrollStory story={longScrollStory} />
          </div>
        </div>
      )}
    </>
  )
}
