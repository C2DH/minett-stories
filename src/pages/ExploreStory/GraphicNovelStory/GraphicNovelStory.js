import classNames from 'classnames'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import AutoTipModal from '../../../components/AutoTipModal'
import LangLink from '../../../components/LangLink'
import LongScrollStory from '../../../components/LongScrollStory'
import StoryPill from '../../../components/StoryPill'
import { getStoryType } from '../../../utils'
import BlockControlsNovel from './BlockControlsNovel'
import styles from './GraphicNovelStory.module.css'
import imageModalTip from './GraphicNovelTip.svg'

function GraphicNoveModuleGallery({ millerModule }) {
  return (
    <div className="h-100 d-flex align-items-center">
      {millerModule.objects.map((obj) => {
        const source =
          obj.document.data?.translated_urls ?? obj.document.attachment
        return (
          <img
            className="h-100"
            src={source}
            key={obj.id}
            alt={obj.document.data.title}
          />
        )
      })}
    </div>
  )
}

function GraphicNoveModuleTextObject({ millerModule }) {
  return (
    <div
      style={{
        background: millerModule.background.color,
        borderRadius: 100,
        color: millerModule.text.color,
      }}
      className={classNames('h-100 d-flex mx-4', {
        'flex-row-reverse': millerModule.layout === 'text-object',
      })}
    >
      <div className="h-100 p-3">
        <img
          style={{ height: '100%', borderRadius: 100 }}
          src={millerModule.object.document.attachment}
          key={millerModule.id}
          alt={millerModule.object.document.data.title}
        />
      </div>
      <div
        style={{ minWidth: 400 }}
        className="p-3  d-flex align-items-center justify-content-center"
      >
        <ReactMarkdown
          className={classNames('text-graphic-novel')}
          skipHtml={true}
        >
          {millerModule.text.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

function GraphicNoveModuleText({ millerModule }) {
  return (
    <div className="h-100 mx-4">
      <div
        className="h-100 d-flex align-items-center justify-content-center"
        style={{
          background: millerModule.background.color,
          width: 530,
          borderRadius: 100,
          color: millerModule.text.color,
        }}
      >
        <ReactMarkdown
          className={classNames('text-graphic-novel')}
          skipHtml={true}
        >
          {millerModule.text.content}
        </ReactMarkdown>
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

  const caption = millerModule.caption

  if (caption !== '') {
    return (
      <div
        className="mx-4 h-100 d-flex flex-column p-3"
        style={{
          background: millerModule.background.color,
          borderRadius: 100,
        }}
      >
        <img
          src={millerModule.document.attachment}
          style={{ height: '85%' }}
          className={`${styles.imgNovel}`}
          alt={millerModule.title}
        />
        <div className="pt-3 text-center">
          <ReactMarkdown
            className={classNames('text-graphic-novel')}
            skipHtml={true}
          >
            {caption}
          </ReactMarkdown>
        </div>
      </div>
    )
  }

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
    case 'text_object':
      return <GraphicNoveModuleTextObject millerModule={millerModule} />
    default:
      console.warn(
        'Missing Component for Miller Module Graphic Novel',
        millerModule.module
      )
      return null
  }
}

function GraphicNovelChapter({
  chapter,
  chapterIndex,
  chapters,
  animation,
  setAnimation,
  setChapterIndex,
}) {
  const { t } = useTranslation()
  return (
    <>
      {chapter.contents.modules.map((millerModule, i) => (
        <GraphicNovelModule millerModule={millerModule} key={i} />
      ))}
      {((chapterIndex === 0 && chapters.length > 1) ||
        (chapters.length > 1 && chapterIndex !== chapters.length - 1)) && (
        <div
          className="h-100 mx-4 pointer"
          onClick={() => {
            if (!animation && chapterIndex < chapters.length - 1) {
              setChapterIndex((i) => i + 1)
              setAnimation('enter-next')
            }
          }}
        >
          <div
            className="h-100 cursor-pointer text-uppercase text-decoration-underline d-flex align-items-center justify-content-center text-font-abc"
            style={{
              background: 'var(--dark-grey)',
              width: 360,
              borderRadius: 100,
              fontSize: 22,
              color: 'white',
            }}
          >
            {t('Go_to_the_next_chapter')}
          </div>
        </div>
      )}
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
    selectedClass = styles.flyLeft
  } else if (animation === 'enter-prev') {
    selectedClass = styles.flyRight
  }

  let enterClass = ''
  if (animation === 'enter-next') {
    enterClass = styles.flyRight
  } else if (animation === 'enter-prev') {
    enterClass = styles.flyLeft
  }

  const containerRef = useRef()

  const scrollNext = useCallback(() => {
    const element = containerRef.current
    if (element) {
      const { width } = element.getBoundingClientRect()
      element.scroll({
        left: element.scrollLeft + width / 2,
        behavior: 'smooth',
      })
    }
  }, [])

  const scrollPrev = useCallback(() => {
    const element = containerRef.current
    if (element) {
      const { width } = element.getBoundingClientRect()
      element.scroll({
        left: element.scrollLeft - width / 2,
        behavior: 'smooth',
      })
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollNext()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [scrollNext, scrollPrev])

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

  const { t } = useTranslation()
  const type = getStoryType(story)

  return (
    <>
      <AutoTipModal
        type="graphicNovel"
        text={t('graphicNovelTip')}
        imageSource={imageModalTip}
      />
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
        <div className={styles.GraphicNovelScrollContainer}>
          {(!animation || !animation.startsWith('end-')) && (
            <div
              key={selectedChapter.id}
              ref={containerRef}
              className={`h-100 w-100 d-flex align-items-center ${styles.novel} ${selectedClass}`}
              style={{ overflowX: 'auto', overflowY: 'hidden' }}
              onTransitionEnd={() => {
                setAnimation((a) => (a ? 'end-' + a.split('-')[1] : null))
              }}
            >
              <GraphicNovelChapter
                chapter={selectedChapter}
                chapterIndex={chapterIndex}
                chapters={novelChapters}
                setChapterIndex={setChapterIndex}
                setAnimation={setAnimation}
                animation={animation}
              />
            </div>
          )}

          {enteringChapter && (
            <div
              key={enteringChapter.id}
              className={`h-100 w-100 d-flex align-items-center ${styles.novel} ${enterClass}`}
              style={{ overflowY: 'auto' }}
              onTransitionEnd={() => setAnimation(null)}
            >
              <GraphicNovelChapter
                chapter={enteringChapter}
                chapterIndex={chapterIndex}
                chapters={novelChapters}
                setChapterIndex={setChapterIndex}
                setAnimation={setAnimation}
                animation={animation}
              />
            </div>
          )}
        </div>
        <BlockControlsNovel
          scrollNext={scrollNext}
          scrollPrev={scrollPrev}
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
