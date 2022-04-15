import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, SkipForward } from 'react-feather'
import LangLink from '../../../components/LangLink'
import VisualModule from '../../../components/VisualModule'
import styles from './GraphicNovelStory.module.css'

function GraphicNoveModuleGallery({ millerModule }) {
  return (
    <div className="h-100 d-flex align-items-center">
      {millerModule.objects.map((obj) => (
        <img
          className="h-100"
          // src={obj.document.data.resolutions.preview.url}
          src={obj.document.attachment}
          key={obj.id}
          alt={obj.document.data.title}
        />
      ))}
    </div>
  )
}

function GraphicNoveModuleText({ millerModule }) {
  return (
    <div className="h-100 border mx-4">
      <div className="h-100 bg-danger" style={{ width: 600 }}>
        HELLO TEXT!
      </div>
    </div>
  )
}

function GraphicNovelModule({ millerModule }) {
  switch (millerModule.module) {
    case 'text':
      return <GraphicNoveModuleText millerModule={millerModule} />
    case 'gallery':
      return <GraphicNoveModuleGallery millerModule={millerModule} />
    default:
      console.warn(
        'Missing Component for Miller Module Graphic Novel',
        millerModule.module
      )
      return null
  }
}

function GraphicNovelChapter({ chapter }) {
  return (
    <>
      {chapter.contents.modules.map((millerModule, i) => (
        <GraphicNovelModule millerModule={millerModule} key={i} />
      ))}
    </>
  )
}

export default function GraphicNovelStory({ story }) {
  // NOTE: Very bad implementation ... buy u know ...
  const novelChapters = useMemo(
    () => story.data.chapters.slice(0, -1),
    [story.data.chapters]
  )
  const [animation, setAnimation] = useState(null)
  const [chapterIndex, setChapterIndex] = useState(0)

  let selectedChapterIndex = chapterIndex
  if (typeof animation === 'string') {
    if (animation.endsWith('-next')) {
      selectedChapterIndex = chapterIndex - 1
    } else if (animation.endsWith('-prev')) {
      selectedChapterIndex = chapterIndex + 1
    }
  }

  const selectedChapter = novelChapters[selectedChapterIndex]
  const enteringChapter = animation ? novelChapters[chapterIndex] : null

  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]

  let selectedClass = ''
  if (animation === 'enter-next') {
    selectedClass = styles.flyRight
  } else if (animation === 'enter-prev') {
    selectedClass = styles.flyLeft
  }

  let enterClass = ''
  if (animation === 'enter-next') {
    enterClass = styles.flyLeft
  } else if (animation === 'enter-prev') {
    enterClass = styles.flyRight
  }

  const containerRef = useRef()

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

  return (
    <div className="w-100 h-100 d-flex flex-column">
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
      <div className="flex-1" style={{ overflow: 'hidden' }}>
        <div className="h-100 w-100">
          {(!animation || !animation.startsWith('end-')) && (
            <div
              key={selectedChapter.id}
              ref={containerRef}
              className={`h-100 w-100 py-4 d-flex align-items-center ${styles.novel} ${selectedClass}`}
              style={{ overflowY: 'auto' }}
              onTransitionEnd={() => {
                setAnimation((a) => (a ? 'end-' + a.split('-')[1] : null))
              }}
            >
              <GraphicNovelChapter chapter={selectedChapter} />
            </div>
          )}

          {enteringChapter && (
            <div
              key={enteringChapter.id}
              className={`h-100 w-100 py-4 d-flex align-items-center ${styles.novel} ${enterClass}`}
              style={{ overflowY: 'auto' }}
              onTransitionEnd={() => setAnimation(null)}
            >
              <GraphicNovelChapter chapter={enteringChapter} />
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.BlockControls} bg-white d-flex w-100`}>
        <div className="d-flex align-items-center justify-content-center mx-2 mx-md-5">
          <SkipForward
            className="cursor-pointer"
            onClick={() => {
              const element = containerRef.current
              if (element) {
                const { width } = element.getBoundingClientRect()
                element.scroll({
                  left: element.scrollLeft + width / 2,
                  behavior: 'smooth',
                })
                console.log({ element })
              }
            }}
            color="black"
            fill="black"
          />
        </div>
        <div style={{ flex: 1 }} className="d-flex flex-column">
          <div className="w-100 d-flex" style={{ height: 8 }}>
            {/* {story.chapters.map((chapter, i) => (
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
            ))} */}
          </div>
          <div
            className="w-100 d-flex align-items-center text-cadet-blue position-relative"
            style={{ flex: 1 }}
          >
            <span className="text-cadet-blue">
              {/* {fromSecondsToProgressStr(playedSeconds)}
              {'/'}
              {fromSecondsToProgressStr(duration)} */}
            </span>
            <span className="text-cadet-blue ms-3 d-none d-md-block">
              {selectedChapter.data.title}
            </span>
            {!goDeeper && (
              <div
                onClick={onGoDeeper}
                style={{ position: 'absolute', left: 0 }}
                className="w-100 d-flex justify-content-center cursor-pointer"
              >
                <div className={`text-color-story-graphic-novel d-flex flex-column align-items-center`}>
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
            className={'btn-circle text-white bg-dark-gray cursor-pointer me-2'}
            disabled={chapterIndex <= 0}
            onClick={() => {
              if (!animation) {
                setChapterIndex((i) => i - 1)
                setAnimation('enter-prev')
              }
            }}
          >
            <ArrowLeft />
          </div>
          <div
            className={'btn-circle text-white bg-dark-gray cursor-pointer'}
            disabled={chapterIndex >= novelChapters.length - 1}
            onClick={() => {
              if (!animation) {
                setChapterIndex((i) => i + 1)
                setAnimation('enter-next')
              }
            }}
          >
            <ArrowRight />
          </div>
        </div>
      </div>
      {goDeeper && (
        <div className="bg-white  ps-3 pe-3 ps-md-0 pe-md-0">
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </div>
  )
}
