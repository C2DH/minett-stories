import find from 'lodash/find'

export function fromSecondsToProgressStr(time) {
  const totalSeconds = Math.round(time)
  const seconds = totalSeconds % 60
  const minutes = (totalSeconds - seconds) / 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export function fromProgressStrToSeconds(str) {
  const [mins, secs] = str.split(':')
  return parseInt(mins) * 60 + parseInt(secs)
}

export function getStoryType(story) {
  // NOTE: Naive implementation lol
  return find(story.tags, (t) => t.category === 'keyword')?.name ?? null
}

export function truncateString(str, num=100, ellipsis='[...]') {
  const s = String(str).trim()

  if (s.length <= num) {
    return s
  }

  const punkt = '.!?;,/- &()'
  let truncated = s.substring(0, num)
  let lastChar = truncated.slice(-1)

  while (punkt.indexOf(lastChar) === -1) {
    truncated = truncated.substring(0, truncated.length -1)
    lastChar = truncated.slice(-1)
  }

  return truncated + ' ' + ellipsis
}
