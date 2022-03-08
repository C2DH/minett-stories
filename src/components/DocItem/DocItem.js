import { memo } from "react"
import LangLink from "../LangLink"
import styles from "./DocItem.module.css"

function DocItem({ doc }) {
  const imageUrl =
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment

  return (
    <LangLink className='text-decoration-none' to={`/document/${doc.slug}`}>
      <div className={styles.item}>
        <img width={200} src={imageUrl} alt={doc.data.title} />
        <h5 className={styles.titleItem}>{doc.data.title}</h5>
      </div>
    </LangLink>
  )
}
export default memo(DocItem)
