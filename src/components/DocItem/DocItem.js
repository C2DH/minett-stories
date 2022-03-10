import classNames from 'classnames'
import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import LangLink from '../LangLink'
import styles from './DocItem.module.css'

function DocItem({ doc, grid }) {
  const location = useLocation()
  const imageUrl = 
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment

  return (
    <LangLink
      className='text-decoration-none'
      to={`/document/${doc.slug}`}
      state={{
        backgroundLocation: location,
      }}
    >
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
    </LangLink>
  )
}
export default memo(DocItem)
