import StoryListItem from "./StoryListItem";

export default function ListStories({ stories }) {
  return (
    <div className="padding-top-bar">
      {stories.map(story => (
        <StoryListItem story={story} key={story.id} />
      ))}
    </div>
  )
}