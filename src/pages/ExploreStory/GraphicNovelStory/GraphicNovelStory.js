import { useCallback, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import LangLink from '../../../components/LangLink'
import VisualModule from '../../../components/VisualModule'
import BlockControlsNovel from './BlockControlsNovel'
import styles from './GraphicNovelStory.module.css'

function GraphicNoveModuleGallery({ millerModule }) {
  return (
    <div className="h-100 d-flex align-items-center">
      {millerModule.objects.map((obj) => (
        <img
          className="h-100"
          src={obj.document.attachment}
          key={obj.id}
          alt={obj.document.data.title}
        />
      ))}
    </div>
  )
}

function GraphicNoveModuleText({ millerModule }) {
  console.log(millerModule)
  return (
    <div className="h-100 mx-4">
      <div
        className="h-100 d-flex align-items-center justify-content-center text-font-abc"
        style={{
          background: millerModule.background.color,
          width: 530,
          borderRadius: 100,
          color: millerModule.text.color,
        }}
      >
        {millerModule.text.content}
      </div>
    </div>
  )
}

function GraphicNoveModuleImage({ millerModule }) {
  const size =
    millerModule.size === 'small'
      ? '50%'
      : millerModule.size === 'medium'
      ? '80%'
      : '100%'
  return (
    <div className="mx-4 h-100 d-flex align-items-center">
      <img
        src={millerModule.document.attachment}
        style={{ height: size }}
        className={`${styles.imgNovel}`}
        alt={millerModule.title}
      />
    </div>
  )
}

function GraphicNovelModule({ millerModule }) {
  switch (millerModule.module) {
    case 'text':
      return <GraphicNoveModuleText millerModule={millerModule} />
    case 'object':
      return <GraphicNoveModuleImage millerModule={millerModule} />
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

  console.log(selectedChapter)

  return (
    <>
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
        <BlockControlsNovel
          containerRef={containerRef}
          story={story}
          selectedChapter={selectedChapter}
          setAnimation={setAnimation}
          animation={animation}
          novelChapters={novelChapters}
          chapterIndex={chapterIndex}
          goDeeper={goDeeper}
          onGoDeeper={onGoDeeper}
          setChapterIndex={setChapterIndex}
        />
      </div>
      {goDeeper && (
        <div className="bg-white  ps-3 pe-3 ps-md-0 pe-md-0">
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </>
  )
}
