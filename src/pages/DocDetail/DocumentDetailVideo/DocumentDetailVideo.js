import { X } from 'react-feather'
import stylesCommon from '../DocDetail.module.css'
// import { useMemo } from 'react'

export default function DocumentDetailVideo({ isModal, doc, onClose }) {
  const videoUrl =
    doc.data.translated_urls && doc.data.translated_urls instanceof String
      ? doc.data.translated_urls
      : doc.url

//   const yt = useMemo(() => {
//     return videoUrl.match(
//       /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
//     )
//       ? true
//       : false
//   }, [videoUrl])
  return (
    <div className={stylesCommon.Document}>
      <div className="row">
        <div className="col-md-12">
          <div className={stylesCommon.TypeDocument}>{doc.type}</div>
          <h2 className={stylesCommon.TitleDocument}>{doc.data.title}</h2>
          <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
          <div>
            <video controls style={{ objectFit: 'cover', width: '100%'}}>
              <source  src={videoUrl} />
            </video>
          </div>
          <div className={`${stylesCommon.DescriptionDocument} mt-4`}>
            {doc.data.description}
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
