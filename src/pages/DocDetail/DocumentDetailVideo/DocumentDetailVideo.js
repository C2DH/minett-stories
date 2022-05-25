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
        <div className="col-md-12 d-flex flex-column">
          <div className={`${stylesCommon.TypeDocument} order-1 order-md-0`}>
            {doc.type}
          </div>
          <h2 className={`${stylesCommon.TitleDocument} order-2 order-md-1`}>
            {doc.data.title}
          </h2>
          <div className={`${stylesCommon.YearDocument} order-3 order-md-2`}>
            {doc.data.year}
          </div>
          <div className="order-0 mt-5 pt-2 order-md-3">
            <video playsinline controls style={{ objectFit: 'cover', width: '100%' }}>
              <source src={videoUrl} />
            </video>
          </div>
          <div className={`${stylesCommon.DescriptionDocument} order-4 mt-4 order-md-4`}>
            {doc.data.description}
          </div>
          <div className='order-5 order-md-5'>
            {doc.data.creator && (
              <div className={`${stylesCommon.Creator}`}>
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
