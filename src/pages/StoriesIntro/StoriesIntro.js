import { useState, useRef, useMemo, useEffect } from 'react'
import { ArrowDown } from 'react-feather'
import { useStories, useStoryWithChapters } from '@c2dh/react-miller'
import LangLink from '../../components/LangLink'
import IntroVoronoi from '../../components/IntroVoronoi'
import { useComponentSize } from 'react-use-size'
import styles from './StoriesIntro.module.css'
import { useNavigate } from 'react-router-dom'
import { useLangPathPrefix } from '../../hooks/langs'
import { useTranslation } from 'react-i18next'
import RoundedLanguageControls from '../../components/RoundedLanguageControls'

const controlPoints = [
  [
    [50, 100],
    [100, 100],
    [100, 50],
  ],
  [
    [20, 100],
    [100, 100],
    [100, 30],
  ],
  [
    [0, 100],
    [100, 100],
    [100, 0],
  ],
]

function ScrollControl({
  texts = [],
  step,
  progress,
  onStepChange,
  onProgress,
  numSteps = 3,
}) {
  const { ref, height } = useComponentSize()
  const stepRef = useRef(0)

  function getOpacity(iterStep) {
    if (step >= iterStep) {
      return 1 - progress * 2
    }
    return progress
  }

  return (
    <div
      ref={ref}
      className="flex-1"
      style={{ overflowY: 'auto' }}
      onScroll={(e) => {
        // console.log(e.target.scrollTop, height)

        const currentStepFractional = e.target.scrollTop / height
        const currentStep = parseInt(currentStepFractional)
        const fraction = currentStepFractional - currentStep

        onProgress(fraction)
        if (currentStep !== stepRef.current) {
          onStepChange(currentStep)
          stepRef.current = currentStep
        }
      }}
    >
      <div style={{ height: height * (numSteps + 1) }}>
        {texts.map((text, i) => {
          return (
            <div
              key={i}
              className={`${styles.TextIntro}`}
              style={{ height, opacity: getOpacity(i) }}
            >
              <div>{text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StoriesIntro() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const [introStory] = useStoryWithChapters('intro')
  const scrollTexts = useMemo(
    () =>
      introStory.data.chapters[0].contents.modules
        .filter((m) => m.module === 'text')
        .slice(0, 3)
        .map((m) => m.text.content),
    [introStory.data.chapters]
  )

  const [storiesList] = useStories({
    params: {
      limit: 1000,
      filters: {
        tags__slug__in: ['theme'],
      },
      exclude: {
        tags__slug__in: ['intro'],
      },
    },
  })

  const { t } = useTranslation()

  const navigate = useNavigate()
  const pathPrefix = useLangPathPrefix()
  useEffect(() => {
    if (step === 3) {
      navigate(`${pathPrefix}/stories/voronoi`)
    }
  }, [navigate, pathPrefix, step])

  return (
    <div className="h-100">
      <RoundedLanguageControls className={styles.BlockLanguages} />
      <div className="h-100 d-flex flex-column">
        <LangLink className={`${styles.Skip}`} to="/stories/voronoi">
          {t('skipIntro')}
        </LangLink>
        <div className="flex-1 d-flex flex-column position-relative">
          <div
            style={{ zIndex: 1, top: 60, left: 60, right: 60, bottom: 60 }}
            className="d-flex flex-column position-absolute"
          >
            <IntroVoronoi
              stories={storiesList.results}
              controlPoints={controlPoints}
              step={step}
              progress={progress}
            />
          </div>
          <div
            style={{ zIndex: 2 }}
            className="h-100 w-100 position-absolute d-flex flex-column"
          >
            <ScrollControl
              step={step}
              progress={progress}
              texts={scrollTexts}
              onStepChange={setStep}
              onProgress={setProgress}
            ></ScrollControl>
          </div>
        </div>
      </div>
      <div className={styles.ScrollDown}>
        <div className='mb-2'>{t('scrollDown')}</div>
        <div className='btn-circle text-white bg-dark-gray'>
          <ArrowDown />
        </div>
      </div>
    </div>
  )
}
