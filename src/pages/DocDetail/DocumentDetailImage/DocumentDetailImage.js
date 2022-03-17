import styles from './DocumentDetailImage.module.css'
import stylesCommon from '../DocDetail.module.css'
import { usePreloadImage } from '../../../hooks/preloadImage'
import ZoomAndPanMedia from '../../../components/ZoomAndPanMedia/ZoomAndPanMedia'

function BlockInfo({ doc }) {
  return (
    <>
      <div className={stylesCommon.TypeDocument}>{doc.type}</div>
      <h2 className={stylesCommon.TitleDocument}>{doc.data.title}</h2>
      <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
      <div className={stylesCommon.DescriptionDocument}>
        {doc.data.description}
      </div>
    </>
  )
}

export default function DocumentDetailImage({ isModal, doc, onClose }) {
  const lowResolutionImage = doc.data.resolutions?.preview?.url
  const highResolutionImage = doc.attachment

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
    <div className={stylesCommon.Document}>
      <div className="row max-h-100">
        <div className="col-md-4">
          <BlockInfo doc={doc} />
        </div>
        <div className="col-md-8">
          <div className={styles.BlockImage}>
            <ZoomAndPanMedia isModal={isModal} src={imageUrl} />
          </div>
        </div>
      </div>
      {isModal && (
        <div className={stylesCommon.CloseModal}>
          <i
            className="cursor-pointer bi bi-x-lg"
            onClick={() => onClose()}
          />
        </div>
      )}
    </div>
  )
}
