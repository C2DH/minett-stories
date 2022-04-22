import { useMedia } from 'use-media'

export function useIsMobileScreen(defaultValue = false) {
  return useMedia(
    {
      minWidth: 150,
      maxWidth: 700,
    },
    defaultValue
  )
}
