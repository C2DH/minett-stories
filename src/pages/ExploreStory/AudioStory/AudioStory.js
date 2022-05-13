import { useCallback, useMemo, useRef, useState } from 'react'
import Player from 'react-player'
import ChaptersProgressBar from '../../../components/ChaptersProgressBar'
import LangLink from '../../../components/LangLink'
import { ArrowLeft, MoreVertical } from 'react-feather'
import styles from './AudioStory.module.css'
import spotify from './assets/spotify.png'
import googlePodcast from './assets/google-podcast.png'
import applePodcast from './assets/apple-podcast.png'
import { useTranslation } from 'react-i18next'
import { useNavigationType } from 'react-router-dom'
import StoryPill from '../../../components/StoryPill'
import { getStoryType } from '../../../utils'
import LongScrollStory from '../../../components/LongScrollStory'

export default function AudioStory({ story }) {
  // NOTE: Very bad implementation ... buy u know ...
  const videoChapters = useMemo(
    () => story.data.chapters.slice(0, -1),
    [story.data.chapters]
  )
  const { t } = useTranslation()
  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]
  const [chapterIndex, setChapterIndex] = useState(0)

  const selectedChapter = videoChapters[chapterIndex]
  const selectedDoc = selectedChapter.contents.modules[0].document
  const audioUrl = selectedDoc?.data?.streamingUrl ?? selectedDoc.url
  const backgroundDocImage =
    selectedChapter.contents.modules[0]?.background?.object?.document
      ?.attachment ?? null

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
  const playerInitRef = useRef(false)
  const onPlayerReady = useCallback(() => {
    if (playerInitRef.current) {
      return
    }
    setDuration(playerRef.current.getDuration())
    if (progress.played > 0) {
      playerRef.current.seekTo(progress.played, 'fraction')
    }
    playerInitRef.current = true
  }, [progress])
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

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

  const [showPodcast, setShowPodcast] = useState(false)

  const type = getStoryType(story)

  return (
    <>
      <div className="w-100 h-100 d-flex flex-column">
        <div
          className="flex-1 position-relative"
          style={{ overflow: 'hidden' }}
        >
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
          {backgroundDocImage && (
            <img
              alt="Background"
              className="h-100 w-100"
              style={{ objectFit: 'cover' }}
              src={backgroundDocImage}
            />
          )}
          <Player
            onEnded={handleOnPlayEnd}
            volume={1}
            muted={muted}
            progressInterval={200}
            ref={playerRef}
            onReady={onPlayerReady}
            width={0}
            height={0}
            url={audioUrl}
            playing={playing}
            onProgress={setProgress}
            playsinline
            config={{ file: { forceAudio: true } }}
          />
          {showPodcast && (
            <div className={styles.showPodcast}>
              <div className={styles.TitlePopupPodcast}>
                {t('listen-to-podcast')}{' '}
              </div>
              <div className="text-center mt-4">
                <img width={198} src={googlePodcast} alt="Google Podcast" />
              </div>
              <div className="text-center mt-4">
                <img width={103} src={spotify} alt="Spotify Podcast" />
              </div>
              <div className="text-center mt-4">
                <img width={108} src={applePodcast} alt="Apple Podcast" />
              </div>
              <div className="d-flex justify-content-center mt-4">
                <div className={styles.DownloadFile}>{t('download-file')}</div>
              </div>
            </div>
          )}
        </div>
        <ChaptersProgressBar
          storyType="audio"
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
            <div className="me-2 cursor-pointer">
              <MoreVertical
                onClick={() => setShowPodcast(!showPodcast)}
                color="var(--orange)"
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
