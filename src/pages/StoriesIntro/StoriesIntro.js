import { useState, useRef } from 'react'
import { useStories, useStoryWithChapters } from '@c2dh/react-miller'
import LangLink from '../../components/LangLink'
import Layout from '../../components/Layout'
import IntroVoronoi from '../../components/IntroVoronoi'
import { useComponentSize } from 'react-use-size'
import styles from './StoriesIntro.module.css'

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

const sampleTexts = [
  'Minett is a region in the South of Luxembourg strongly influenced by its industrial past.',
  'The website investigates the multiple and sometimes contested identities of the region and of the people who lived and worked there.',
  'The website investigates the multiple and sometimes contested identities of the region and of the people who lived and worked there.'
]

function ScrollControl({ texts = [], onStepChange, onProgress, numSteps = 3 }) {
  const { ref, height, width } = useComponentSize()
  const step = useRef(0)

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
        if (currentStep !== step.current) {
          onStepChange(currentStep)
          step.current = currentStep
        }
      }}
    >
      <div style={{ height: height * (numSteps + 1) }}>
        {texts.map((text, i) => {
          return (
            <div
              key={i}
              className={`${styles.TextIntro}`}
              style={{ height }}
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

  return (
    <Layout>
      <div className="padding-top-bar h-100">
        <div className="h-100  d-flex flex-column">
          <LangLink className={`${styles.Skip}`} to="/stories/voronoi">
            Skip Intro
          </LangLink>
          {/* <div className={styles.ScrollDown}>Scroll Down</div> */}
          <div className="flex-1 d-flex flex-column position-relative">
            <div
              style={{ zIndex: 1 }}
              className="h-100 w-100 d-flex flex-column position-absolute"
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
                texts={sampleTexts}
                onStepChange={setStep}
                onProgress={setProgress}
              ></ScrollControl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
