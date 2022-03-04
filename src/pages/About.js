import { useStory } from '@c2dh/react-miller'

export default function About() {
  const [story] = useStory('about')

  return (
    <div>
      <h1>{story.data.title}</h1>
      <p>{story.data.abstract}</p>
    </div>
  )
}
