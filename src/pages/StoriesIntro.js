import { useState, useCallback } from 'react'
import { useStories, useStoryWithChapters } from '@c2dh/react-miller'
import LangLink from '../components/LangLink'
import Layout from '../components/Layout'
import IntroVoronoi from '../components/IntroVoronoi'


const controlPoints = [
  [[0, 100], [100, 100], [100, 50]],
  [[0, 100], [100, 100], [100, 0]],
]


export default function StoriesIntro() {

  const [step, setStep] = useState(1)
  const nextStep = useCallback(() => {
    if(step < 3){setStep(step + 1)}
  }, [step])

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
          <LangLink to="/stories/voronoi">Skip</LangLink>
          <button className="btn btn-primary" onClick={nextStep} disabled={!storiesList?.results.length}>next step</button>
          <IntroVoronoi stories={storiesList.results} controlPoints={controlPoints} step={step}/>
        </div>
      </div>
    </Layout>
  )
}
