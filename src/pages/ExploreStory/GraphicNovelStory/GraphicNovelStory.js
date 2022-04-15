import { useMemo, useRef, useState } from 'react'
import styles from './GraphicNovelStory.module.css'

function GraphicNovelChapter({ chapter }) {
  const objs = chapter.contents.modules[0].objects
  return (
    <div className="h-100 d-flex align-items-center">
      {objs.map((o) => (
        <img
          style={{ height: '100%' }}
          src={o.document.attachment}
          key={o.id}
          alt="X"
        />
      ))}
    </div>
  )
}

export default function GraphicNovelStory({ story }) {
  // NOTE: Very bad implementation ... buy u know ...
  const novelChapters = useMemo(
    () => story.data.chapters.slice(0, -1).concat(story.data.chapters.slice(0, -1).map(c => ({ ...c, id: c.id + 100 }))),
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
          {(!animation || !animation.startsWith('end-')) && <div
            key={selectedChapter.id}
            ref={containerRef}
            className={`h-100 w-100 py-4 d-flex align-items-center ${styles.novel} ${selectedClass}`}
            style={{ overflowY: 'auto' }}
            onTransitionEnd={() => {
              setAnimation(a => a ? 'end-' + a.split('-')[1] : null)
            }}
          >
            <GraphicNovelChapter chapter={selectedChapter} />
          </div>}

          {enteringChapter && <div
            key={enteringChapter.id}
            className={`h-100 w-100 py-4 d-flex align-items-center ${styles.novel} ${enterClass}`}
            style={{ overflowY: 'auto' }}
            onTransitionEnd={() => setAnimation(null)}
          >
            <GraphicNovelChapter chapter={enteringChapter} />
          </div>}
        </div>
      </div>
      <div style={{ height: 50 }} className="bg-secondary">
         <div>{JSON.stringify({ chapterIndex, selectedClass, enterClass, animation })}</div>
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
              setChapterIndex(i => i - 1)
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
              setChapterIndex(i => i + 1)
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
