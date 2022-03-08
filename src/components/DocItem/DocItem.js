import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import LangLink from '../LangLink'

function DocItem({ doc }) {
  const location = useLocation()
  const imageUrl =
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment

  return (
    <LangLink to={`/document/${doc.slug}`} state={{
      backgroundLocation: location,
    }}>
      <div>
        <h5>{doc.data.title}</h5>
        <img height={100} src={imageUrl} alt={doc.data.title} />
      </div>
    </LangLink>
  )
}
export default memo(DocItem)
