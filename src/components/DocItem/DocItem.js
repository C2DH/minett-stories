import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import LangLink from '../LangLink'
import styles from './DocItem.module.css'

function DocItem({ doc }) {
  const location = useLocation()
  const imageUrl =
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment

  return (
    <LangLink
      className="text-decoration-none"
      to={`/document/${doc.slug}`}
      state={{
        backgroundLocation: location,
      }}
    >
      <div className={styles.item}>
        <img className={styles.Image} src={imageUrl} alt={doc.data.title} />
        <h5 className={styles.titleItem}>{doc.data.title}</h5>
      </div>
    </LangLink>
  )
}
export default memo(DocItem)
