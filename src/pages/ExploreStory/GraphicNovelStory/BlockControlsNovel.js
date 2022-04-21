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

export default function BlockControlsNovel({
  containerRef,
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
  return (
    <div className={`${styles.BlockControls} bg-white d-flex w-100`}>
      <div className="d-flex align-items-center justify-content-center mx-2 mx-md-5 col-2">
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
      <div style={{ flex: 1 }} className="d-flex flex-column col-8">
        <div className="w-100 d-flex" style={{ height: 8 }}>
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
          className="w-100 d-flex align-items-center text-cadet-blue position-relative col-2"
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
                <span className="d-none d-md-block">Go deeper (10 min.)</span>
                <ArrowDown
                  className="ms-0"
                  color={`var(--color-story-graphic-novel)`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mx-2 mx-md-5">
        <div
          className={classNames(
            'btn-circle text-white bg-dark-gray cursor-pointer me-2'
            // {
            //   ControlDisabled: chapterIndex <= 0,
            // }
          )}
          // onClick={() => {
          //   if (!animation && chapterIndex > 0) {
          //     setChapterIndex((i) => i - 1)
          //     setAnimation('enter-prev')
          //   }
          // }}
          onClick={() => {
            const element = containerRef.current
            if (element) {
              const { width } = element.getBoundingClientRect()
              element.scroll({
                left: element.scrollLeft - width / 2,
                behavior: 'smooth',
              })
              // console.log({ element })
            }
          }}
        >
          <ChevronLeft />
        </div>
        <div
          className={classNames(
            'btn-circle text-white bg-dark-gray cursor-pointer'
            // {
            //   ControlDisabled: chapterIndex >= novelChapters.length - 1,
            // }
          )}
          // onClick={() => {
          //   if (!animation && chapterIndex < novelChapters.length - 1) {
          //     setChapterIndex((i) => i + 1)
          //     setAnimation('enter-next')
          //   }
          // }}
          onClick={() => {
            const element = containerRef.current
            if (element) {
              const { width } = element.getBoundingClientRect()
              element.scroll({
                left: element.scrollLeft + width / 2,
                behavior: 'smooth',
              })
              // console.log({ element })
            }
          }}
        >
          <ChevronRight />
        </div>
      </div>
    </div>
  )
}
