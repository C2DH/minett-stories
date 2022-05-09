import { Fragment } from 'react'
import {
  ArrowDown,
  Pause,
  Play,
  SkipForward,
  Volume1,
  VolumeX,
} from 'react-feather'
import { useTranslation } from 'react-i18next'
import { fromSecondsToProgressStr } from '../utils'
import MediaProgressLine from './MediaProgressLine'

export default function ChaptersProgressBar({
  playing,
  togglePlay,
  goToNextChapter,
  onSeek,
  chapters,
  index,
  played,
  playedSeconds,
  duration,
  goDeeper,
  onGoDeeper,
  muted,
  toggleMuted,
  storyType,
  actions = null,
}) {
  const selectedChapter = chapters[index]
  const { t } = useTranslation()
  return (
    <div className='bg-white d-flex flex-column align-items-center'>
      <div className="progress-bar-story d-flex ms-md-5 me-md-5" style={{ height: 8 }}>
        {chapters.map((chapter, i) => (
          <Fragment key={chapter.id}>
            {i !== 0 && (
              <div className="bg-white h-100" style={{ width: 20 }} />
            )}
            <MediaProgressLine
              storyType={storyType}
              index={i}
              onSeek={onSeek}
              played={i === index ? played : 0}
            />
          </Fragment>
        ))}
      </div>
      <div className="w-100 d-flex justify-content-between bg-white" style={{ height: 64 }}>
        <div className="d-flex flex-1-mobile align-items-center justify-content-center mx-md-5">
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
        <div className="d-flex flex-column"  style={{ flex: 1 }}>
          <div
            className="w-100 d-flex align-items-center text-cadet-blue position-relative"
            style={{ flex: 1 }}
          >
            <span className="text-cadet-blue d-none d-md-block duration-player">
              {fromSecondsToProgressStr(playedSeconds)}
              {'/'}
              {fromSecondsToProgressStr(duration)}
            </span>
            <span className="text-cadet-blue ms-md-3 ms-0 d-none d-md-block">
              {selectedChapter.data.title}
            </span>
            {!goDeeper && (
              <div
                onClick={onGoDeeper}
                style={{ position: 'absolute', left: 0 }}
                className="w-100 d-flex justify-content-center cursor-pointer"
              >
                <div
                  className={`text-color-story-${storyType} d-flex align-items-center flex-column`}
                >
                  <span className="d-none d-md-block">{t('go_deeper')}</span>
                  <ArrowDown
                    className="ms-0 ms-md-2"
                    color={`var(--color-story-${storyType})`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-1-mobile align-items-center justify-content-center mx-md-5">
          {actions}
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
