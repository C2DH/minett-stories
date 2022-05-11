import { usePrefetchDocument } from '@c2dh/react-miller'
import { useLocation } from 'react-router-dom'
import LangLink from './LangLink'

export default function DocLink({
  slugOrId,
  state,
  prefetchOnOver = false,
  prefetchOnClick = false,
  onClick,
  onMouseOver,
  ...props
}) {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()
  return (
    <LangLink
      {...props}
      onMouseOver={(e) => {
        if (prefetchOnOver) {
          prefetchDocument(slugOrId)
        }
        if (onMouseOver) {
          onMouseOver(e)
        }
      }}
      onClick={e => {
        if (prefetchOnClick) {
          prefetchDocument(slugOrId)
        }
        if (onClick) {
          onClick(e)
        }
      }}
      to={`/document/${slugOrId}`}
      state={{
        ...state,
        backgroundLocation: location,
      }}
    />
  )
}
