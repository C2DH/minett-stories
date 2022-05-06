import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import stylesCommon from '../DocDetail.module.css'
import styles from './DocumentDetailAudio.module.css'

export default function DocumentDetailAudio({ isModal, doc, onClose }) {
  const audioUrl = doc.url ? doc.url : doc.attachment
  const { t } = useTranslation()
  return (
    <div
      className={isModal ? stylesCommon.DocumentModal : stylesCommon.Document}
    >
      <div className="row">
        <div className="col-md-12  d-flex flex-column">
          <div className={`${stylesCommon.TypeDocument} order-1 order-md-0`}>
            {doc.type}
          </div>
          <h2 className={`${stylesCommon.TitleDocument} order-2 order-md-1`}>
            {doc.data.title}
          </h2>
          <div className={`${stylesCommon.YearDocument} order-3 order-md-2`}>
            {doc.data.year}
          </div>
          <div>
            <audio
              className={`${styles.audio} order-0 order-md-3`}
              controls
              width="100%"
            >
              <source src={audioUrl} />
            </audio>
          </div>
          <div
            className={`${stylesCommon.DescriptionDocument} order-4 order-md-4`}
          >
            {doc.data.description}
          </div>
          <div className="order-5 order-md-5">
            {doc.data.creator && (
              <div className={stylesCommon.Creator}>
                <div className="text-uppercase">{t('creator')} </div>
                <div>{doc.data.creator}</div>
              </div>
            )}
            {doc.data.provenance && (
              <div className={stylesCommon.Creator}>
                <div className="text-uppercase">{t('provenance')} </div>
                <div>{doc.data.provenance}</div>
              </div>
            )}
            {doc.data.copyright && (
              <div className={stylesCommon.Copyright}>
                <div className="text-uppercase">{t('copyright')} </div>
                <div>{doc.data.copyright}</div>
              </div>
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
