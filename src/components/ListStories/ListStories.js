import StoryListItem from "./StoryListItem";

export default function ListStories({ stories }) {
  return (
    <div>
      {stories.map(story => (
        <StoryListItem story={story} key={story.id} />
      ))}
    </div>
  )
}