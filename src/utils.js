import find from 'lodash/find'

export function fromSecondsToProgressStr(time) {
  const totalSeconds = Math.round(time)
  const seconds = totalSeconds % 60
  const minutes = (totalSeconds - seconds) / 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export function getStoryType(story) {
  // NOTE: Naive implementation lol
  return find(story.tags, (t) => t.category === 'keyword')?.name ?? null
}
