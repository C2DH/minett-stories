import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Player from 'react-player'
import find from 'lodash/find'
import { fromProgressStrToSeconds, getStoryType } from '../../../utils'
import InteractiveGrid from '../../../components/InteractiveGrid'
import LangLink from '../../../components/LangLink'
import DocLink from '../../../components/DocLink'
import ChaptersProgressBar from '../../../components/ChaptersProgressBar'
import { ArrowLeft, Maximize } from 'react-feather'
import imageModalTip from './VideoTip.svg'
import AutoTipModal from '../../../components/AutoTipModal'
import { useIsMobileScreen } from '../../../hooks/screen'
import { useTranslation } from 'react-i18next'
import { useNavigationType } from 'react-router-dom'
import styles from './InteractiveVideoStory.module.css'
import StoryPill from '../../../components/StoryPill'
import LongScrollStory from '../../../components/LongScrollStory'

function objInTime(obj, seconds) {
  return (
    seconds >= fromProgressStrToSeconds(obj.from) &&
    seconds <= fromProgressStrToSeconds(obj.to)
  )
}

export default function InteractiveVideoStory({ story }) {
  const { t } = useTranslation()

  // NOTE: Wait first render to decide between mobile / desktop
  const isMobileScreen = useIsMobileScreen(null)

  // NOTE: Very bad implementation ... buy u know ...
  const videoChapters = useMemo(
    () => story.data.chapters.slice(0, -1),
    [story.data.chapters]
  )
  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]
  const [chapterIndex, setChapterIndex] = useState(0)

  const selectedChapter = videoChapters[chapterIndex]
  const selectedDoc = selectedChapter.contents.modules[0].object.document
  const videoUrl = selectedDoc?.data?.streamingUrl ?? selectedDoc.url

  // NOTE: Grab subtitles in current language
  const subtitlesFile = useMemo(() => {
    // TODO: Re-enable when got the real vtt
    if (chapterIndex === 0) {
      return '/vtt/test.vtt'
    }
    return '/vtt/test2.vtt'
    // return (
    //   find(selectedDoc?.data?.subtitles ?? [], {
    //     language: i18n.language,
    //     availability: true,
    //     type: 'vtt',
    //   })?.url ?? null
    // )
  }, [chapterIndex])

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
  }, [handleCueChange, progress])

  useEffect(() => {
    return () => {
      if (trackRef.current !== null) {
        trackRef.current.removeEventListener('cuechange', handleCueChange)
        trackRef.current = null
      }
    }
  }, [handleCueChange])

  const handleSeek = useCallback(
    (index, progress) => {
      setChapterIndex(index)
      setProgress({
        played: progress,
        playedSeconds: null, // Will auto set by my player
      })
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

  // Find stuff related 2 video player time
  const relatedObjs = selectedChapter.contents.modules[0].objects
  const speakers = selectedChapter.contents.modules[0].speakers

  const leftObj = useMemo(() => {
    if (progress.playedSeconds === null) {
      return null
    }
    return (
      find(
        relatedObjs,
        (o) => o.tags === 'left' && objInTime(o, progress.playedSeconds)
      ) ?? null
    )
  }, [progress.playedSeconds, relatedObjs])
  const rightObj = useMemo(() => {
    if (progress.playedSeconds === null) {
      return null
    }
    return (
      find(
        relatedObjs,
        (o) => o.tags === 'right' && objInTime(o, progress.playedSeconds)
      ) ?? null
    )
  }, [progress.playedSeconds, relatedObjs])

  const speakingSpeaker = useMemo(() => {
    if (progress.playedSeconds === null) {
      return null
    }
    return find(speakers, (o) => objInTime(o, progress.playedSeconds)) ?? null
  }, [progress.playedSeconds, speakers])

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

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

  const type = getStoryType(story)

  return (
    <>
      {isMobileScreen === false && (
        <AutoTipModal
          type="interactiveVideo"
          text={t('interactiveVideoTip')}
          imageSource={imageModalTip}
        />
      )}
      <div className="w-100 h-100 d-flex flex-column">
        <LangLink
          to={`/story/${story.slug}`}
          className={`${styles.BackButton} btn-circle cursor-pointer no-link`}
        >
          <ArrowLeft />
        </LangLink>
        {isMobileScreen === null ? (
          // NOTE: Placeholder for avoid too layout shift when SSR
          <div className="h-100 w-100" />
        ) : (
          <InteractiveGrid
            playing={playing}
            position={isMobileScreen ? { top: 50, left: 50 } : null}
            topLeft={
              !isMobileScreen && (
                <div
                  className={`${styles.subtitlesContainer} w-100 h-100 d-flex flex-column`}
                >
                  <div className={'w-100 flex-1 d-flex flex-column'}>
                    {subtitles.map((sub, i) => (
                      <div key={i}>{sub}</div>
                    ))}
                  </div>
                  {speakingSpeaker && (
                    <div className={styles.subtitlesSpeaker}>
                      {speakingSpeaker.document.data.title}
                    </div>
                  )}
                </div>
              )
            }
            disableDrag={isMobileScreen}
            video={
              <>
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
                {isMobileScreen && (
                  <div className={styles.subtitlesMobile}>
                    {subtitles.map((sub, i) => (
                      <div key={i}>{sub}</div>
                    ))}
                  </div>
                )}
              </>
            }
            bottomLeftDoc={leftObj?.document ?? null}
            // bottomLeftDoc={hackVideoDocRelated}
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
            bottomRightDoc={rightObj?.document ?? null}
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
        )}
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
          actions={
            <div className="me-3 cursor-pointer text-black">
              <Maximize
                onClick={() => {
                  if (!process.env.IS_SNEXT_SERVER) {
                    import('screenfull').then(({ default: screenfull }) => {
                      console.log(screenfull)
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
        <div>
          <div className="bg-white">
            <div className="row pt-4 text-black">
              <div className="col-md-6 offset-md-3 d-flex flex-column align-items-start">
                <StoryPill type={type} />
                <h1 className={`${styles.TitleStory} m-0 p-0 mt-3`}>
                  {story.data.title}
                </h1>
                <div className={`${styles.ResearchText} text-cadet-blue mt-3`}>
                  {story.authors.map((a) => a.fullname).join(', ')}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white ps-0 pe-0 ps-md-0 pe-md-0">
            <LongScrollStory story={longScrollStory} />
          </div>
        </div>
      )}
    </>
  )
}
