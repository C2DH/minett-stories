import classNames from 'classnames'
import { memo } from 'react'
import DocLink from '../DocLink'
import styles from './DocItem.module.css'

function DocItem({ doc, grid }) {
  const imageUrl =
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment

  return (
    <DocLink className="text-decoration-none" slugOrId={doc.slug}>
      <div
        className={classNames({
          [styles.itemS]: grid === 'S',
          [styles.itemM]: grid === 'M',
          [styles.itemL]: grid === 'L',
        })}
      >
        <img
          className={classNames({
            [styles.ImageS]: grid === 'S',
            [styles.ImageM]: grid === 'M',
            [styles.ImageL]: grid === 'L',
          })}
          src={imageUrl}
          alt={doc.data.title}
        />
        {grid !== 'S' && (
          <h5
            className={classNames({
              [styles.titleItem]: grid !== 'L',
              [styles.titleItemL]: grid === 'L',
            })}
          >
            {doc.data.title}
          </h5>
        )}
        {grid === 'L' && <div className={styles.yearInfo}>{doc.data.year}</div>}
      </div>
    </DocLink>
  )
}
export default memo(DocItem)
