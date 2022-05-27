import classNames from 'classnames'
import { memo } from 'react'
import { Headphones, Video } from 'react-feather'
import styles from './DocItem.module.css'

function DocItem({ doc, grid }) {
  const imageUrl =
    doc.data.resolutions?.thumbnail?.url ?? doc.snapshot ?? doc.attachment

  return (
    <div
      className={classNames(styles.item, {
        [styles.itemS]: grid === 'S',
      })}
    >
      <div className={styles.itemImageContainer}>
        <div className={styles.innerImageContainer}>
          {doc.type === 'audio'
            ? <Headphones color="white"/>
            : doc.type === 'video' && !imageUrl
              ? <Video color="white"/>
              : <img className={styles.image} src={imageUrl} alt={doc.data.title} />
          }
        </div>
      </div>
      {grid !== 'S' && (
        <h5 className={classNames(styles.titleItem)}>{doc.data.title}</h5>
      )}
      {grid === 'L' && <div className={styles.yearInfo}>{doc.data.year}</div>}
    </div>
  )
}
export default memo(DocItem)
