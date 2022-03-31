import { Fragment } from 'react'
import {
  ArrowDown,
  Pause,
  Play,
  SkipForward,
  Volume1,
  VolumeX,
} from 'react-feather'
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
  return (
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
        <div
          className="w-100 d-flex align-items-center text-cadet-blue position-relative"
          style={{ flex: 1 }}
        >
          <span className="text-cadet-blue">
            {fromSecondsToProgressStr(playedSeconds)}
            {'/'}
            {fromSecondsToProgressStr(duration)}
          </span>
          <span className="text-cadet-blue ms-3">
            {selectedChapter.data.title}
          </span>
          {!goDeeper && (
            <div
              onClick={onGoDeeper}
              style={{ position: 'absolute', left: 0 }}
              className="w-100 d-flex justify-content-center cursor-pointer"
            >
              <div className={`text-color-story-${storyType}`}>
                Go deeper (10 min.)
                <ArrowDown
                  className="ms-2"
                  color={`var(--color-story-${storyType})`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mx-5">
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
  )
}
