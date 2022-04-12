import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import stylesCommon from '../DocDetail.module.css'

export default function DocumentDetailVideo({ isModal, doc, onClose }) {
  const videoUrl = doc.data.streamingUrl ? doc.data.streamingUrl : doc.url

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
            <video controls style={{ objectFit: 'cover', width: '100%' }}>
              <source src={videoUrl} />
            </video>
          </div>
          <div className={`${stylesCommon.DescriptionDocument} mt-4`}>
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
