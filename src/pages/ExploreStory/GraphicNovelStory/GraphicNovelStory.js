import { useMemo, useRef, useState } from 'react'
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
      <div className='h-100 bg-danger' style={{ width: 600 }}>
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

  return (
    <div className="w-100 h-100 d-flex flex-column">
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
      <div
        style={{ height: 50 }}
        className="bg-secondary d-flex align-items-center justify-content-center"
      >
        <button
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
        >
          {'~>'}
        </button>
        <button
          disabled={chapterIndex <= 0}
          onClick={() => {
            if (!animation) {
              setChapterIndex((i) => i - 1)
              setAnimation('enter-prev')
            }
          }}
        >
          {'<<'}
        </button>
        <button
          disabled={chapterIndex >= novelChapters.length - 1}
          onClick={() => {
            if (!animation) {
              setChapterIndex((i) => i + 1)
              setAnimation('enter-next')
            }
          }}
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}
