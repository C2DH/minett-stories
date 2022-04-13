import stylesCommon from '../DocDetail.module.css'
import { useTranslation } from 'react-i18next'
import { X } from 'react-feather'

function BlockInfo({ doc }) {
  const { t } = useTranslation()
  return (
    <>
      <div className={stylesCommon.TypeDocument}>{doc.type}</div>
      <h2 className={stylesCommon.TitleDocument}>{doc.data.title}</h2>
      <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
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
    </>
  )
}

export default function DocumentDetailPdfMobile({ isModal, doc, onClose }) {
  let pdfUrl = doc.attachment
  if (process.env.NODE_ENV !== 'production') {
    const baseUrlRegex = /http(s)?:\/\/([^/]+)/
    const baseUrl = 'http://localhost:3000'
    pdfUrl = pdfUrl.replace(baseUrlRegex, baseUrl)
  }

  console.log(doc)

  return (
    <div
      className={isModal ? stylesCommon.DocumentModal : stylesCommon.Document}
    >
      <div className="row max-h-100">
        <div className="col-md-8">
          <img src={doc.snapshot} alt={doc.title} className="img-fluid mt-5" />
        </div>
        <div className="col-md-4 pb-4">
          <BlockInfo doc={doc} />
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
