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
        <div className="col-md-12">
          <div className={stylesCommon.TypeDocument}>{doc.type}</div>
          <h2 className={stylesCommon.TitleDocument}>{doc.data.title}</h2>
          <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
          <div>
            <audio className={styles.audio} controls width="100%">
              <source src={audioUrl} />
            </audio>
          </div>
          <div className={stylesCommon.DescriptionDocument}>
            {doc.data.description}
          </div>
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
