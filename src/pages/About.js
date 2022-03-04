import { useStory } from '@c2dh/react-miller'

export default function About() {
  const [story] = useStory('about')

  return <div>
    {story && (
      <div>{story.data.abstract}</div>
    )}
  </div>
}
