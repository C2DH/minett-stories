import classNames from 'classnames'
import { Fragment } from 'react'
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
} from 'react-feather'
import styles from './GraphicNovelStory.module.css'
import { useTranslation } from 'react-i18next'

export default function BlockControlsNovel({
  scrollNext,
  scrollPrev,
  story,
  selectedChapter,
  goDeeper,
  onGoDeeper,
  setChapterIndex,
  chapterIndex,
  animation,
  novelChapters,
  setAnimation,
}) {
  const { t } = useTranslation()

  return (
    <div
      className={`bg-white d-flex flex-column align-items-center ${styles.GraphicNovelBottomBar}`}
    >
      <div
        className="progress-bar-story d-flex ms-md-5 me-md-5"
        style={{ height: 8 }}
      >
        {story.data.chapters.slice(0, -1).map((chapter, i) => (
          <Fragment key={chapter.id}>
            {i !== 0 && (
              <div className="bg-white h-100" style={{ width: 20 }} />
            )}
            <div
              onClick={() => setChapterIndex(i)}
              className="w-100 h-100 d-flex cursor-pointer"
              style={{
                backgroundColor: `var(--opacity-color-story-graphic-novel)`,
              }}
            >
              <div
                style={{
                  width:
                    chapter.id === selectedChapter.id
                      ? `${(1 * 100).toFixed(4)}%`
                      : 0,
                  backgroundColor: `var(--color-story-graphic-novel)`,
                }}
              />
            </div>
          </Fragment>
        ))}
      </div>
      <div
        className="w-100 d-flex justify-content-between bg-white"
        style={{ height: 64 }}
      >
        <div className="d-flex flex-1-mobile align-items-center justify-content-center mx-md-5">
          <SkipBack
            className="cursor-pointer"
            onClick={() => {
              if (!animation && chapterIndex > 0) {
                setChapterIndex((i) => i - 1)
                setAnimation('enter-prev')
              }
            }}
            color="black"
            fill="black"
            opacity={chapterIndex > 0 ? 1 : 0.4}
          />
          <SkipForward
            className="cursor-pointer ms-3"
            onClick={() => {
              if (!animation && chapterIndex < novelChapters.length - 1) {
                setChapterIndex((i) => i + 1)
                setAnimation('enter-next')
              }
            }}
            color="black"
            fill="black"
            opacity={chapterIndex !== novelChapters.length - 1 ? 1 : 0.4}
          />
        </div>
        <div className="d-flex flex-column" style={{ flex: 1 }}>
          <div
            className="w-100 d-flex align-items-center text-cadet-blue position-relative"
            style={{ flex: 1 }}
          >
            <span className="text-cadet-blue"></span>
            <span className="text-cadet-blue ms-3 d-none d-md-block">
              {selectedChapter.data.title}
            </span>
            {!goDeeper && (
              <div
                onClick={onGoDeeper}
                style={{ position: 'absolute', left: 0 }}
                className="w-100 d-flex justify-content-center cursor-pointer"
              >
                <div
                  className={`text-color-story-graphic-novel d-flex flex-column align-items-center`}
                >
                  <span className="d-none d-md-block">{t('go_deeper')}</span>
                  <ArrowDown
                    className="ms-0"
                    color={`var(--color-story-graphic-novel)`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-1-mobile align-items-center justify-content-center mx-md-5">
          <div
            className={classNames(
              'btn-circle text-white bg-dark-gray cursor-pointer me-2'
            )}
            onClick={() => {
              scrollPrev()
            }}
          >
            <ChevronLeft />
          </div>
          <div
            className={classNames(
              'btn-circle text-white bg-dark-gray cursor-pointer'
            )}
            onClick={() => {
              scrollNext()
            }}
          >
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  )
}
