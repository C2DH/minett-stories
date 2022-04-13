import styles from './DocumentDetailImage.module.css'
import stylesCommon from '../DocDetail.module.css'
import { usePreloadImage } from '../../../hooks/preloadImage'
import ZoomAndPanMedia from '../../../components/ZoomAndPanMedia/ZoomAndPanMedia'
import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../../hooks/mobile'
import classNames from 'classnames'

function BlockInfo({ doc }) {
  const { t } = useTranslation()
  return (
    <>
      <div className={stylesCommon.TypeDocument}>{doc.type}</div>
      <h2 className={stylesCommon.TitleDocument}>
        {doc.data.title || doc.title}
      </h2>
      <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
      <div className={stylesCommon.DescriptionDocument}>
        {doc.data.description}
      </div>
      <div className={stylesCommon.RelatedStory}></div>
      {doc.data.creator && (
        <div className={stylesCommon.Creator}>
          <div className="text-uppercase">{t('creator')} </div>
          <div>{doc.data.creator}</div>
        </div>
      )}
      {doc.data.creator && (
        <div className={stylesCommon.Creator}>
          <div className="text-uppercase">{t('provenance')} </div>
          <div>{doc.data.creator}</div>
        </div>
      )}
      {doc.data.copyright && (
        <div className={stylesCommon.Copyright}>
          <div className="text-uppercase">{t('copyright')} </div>
          <div>{doc.data.copyright}</div>
        </div>
      )}
    </>
  )
}

export default function DocumentDetailImage({ isModal, doc, onClose }) {
  const lowResolutionImage = doc.data.resolutions?.preview?.url
  const highResolutionImage = doc.attachment
  const isMobile = useIsMobile()

  // Preload the high resolution image only if we have
  // a fallback low resolution image
  const isLoaded = usePreloadImage(
    lowResolutionImage ? highResolutionImage : null
  )

  // Use the low resolution when not loaded or when we have no high
  // resolution image
  let imageUrl
  if (!isLoaded && lowResolutionImage) {
    imageUrl = lowResolutionImage
  } else {
    imageUrl = highResolutionImage
  }
  return (
    <div
      className={isModal ? stylesCommon.DocumentModal : stylesCommon.Document}
    >
      <div className="row max-h-100">
        <div
          className={classNames('col-md-4', {
            'order-1': isMobile,
          })}
        >
          <BlockInfo doc={doc} />
        </div>
        <div
          className={classNames('col-md-8', {
            'order-0': isMobile,
          })}
        >
          <div className={styles.BlockImage}>
            {!isMobile ? (
              <ZoomAndPanMedia isModal={isModal} src={imageUrl} />
            ) : (
              <img src={imageUrl} alt={doc.title} className="img-fluid mt-5" />
            )}
          </div>
        </div>
      </div>
      {isModal && (
        <div className={stylesCommon.CloseModal}>
          <X className="cursor-pointer" onClick={() => onClose()} />
        </div>
      )}
    </div>
  )
}
