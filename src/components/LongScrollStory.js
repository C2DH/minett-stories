import VisualModule from './VisualModule'

export default function LongScrollStory({ story }) {
  return (
    <>
      {story.contents.modules.map((millerModule, i) => (
        <VisualModule key={i} millerModule={millerModule} />
      ))}
    </>
  )
}
