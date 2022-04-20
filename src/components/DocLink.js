import { useLocation } from 'react-router-dom'
import LangLink from './LangLink'

export default function DocLink({ slugOrId, state, ...props }) {
  const location = useLocation()
  return (
    <LangLink
      {...props}
      to={`/document/${slugOrId}`}
      state={{
        ...state,
        backgroundLocation: location,
      }}
    />
  )
}
