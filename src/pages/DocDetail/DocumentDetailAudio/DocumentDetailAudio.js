import stylesCommon from '../DocDetail.module.css'
import styles from './DocumentDetailAudio.module.css'

export default function DocumentDetailAudio({ isModal, doc, onClose }) {
  const audioUrl = doc.url ? doc.url : doc.attachment
  return (
    <div className={stylesCommon.Document}>
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
          <div className={styles.creator}>
            CREATOR <br />
            {doc.data.creator}
          </div>
          <div className={styles.provenance}>
            PROVENANCE <br />
            {doc.data.provenance}
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
