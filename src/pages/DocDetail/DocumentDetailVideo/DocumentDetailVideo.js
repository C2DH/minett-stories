import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import stylesCommon from '../DocDetail.module.css'
// import { useMemo } from 'react'

export default function DocumentDetailVideo({ isModal, doc, onClose }) {
  const videoUrl =
    doc.data.translated_urls && doc.data.translated_urls instanceof String
      ? doc.data.translated_urls
      : doc.url

  const { t } = useTranslation()

  //   const yt = useMemo(() => {
  //     return videoUrl.match(
  //       /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
  //     )
  //       ? true
  //       : false
  //   }, [videoUrl])
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
              <div className="text-uppercase">{t('crator')} </div>
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
