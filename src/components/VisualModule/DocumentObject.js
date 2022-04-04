import DocLink from '../DocLink'
import Caption from './Caption'

export default function DocumentObject({ doc, caption, className, size }) {
  if (doc.type === 'image' || doc.type === 'pdf') {
    const imagePreviewUrl = doc.data.resolutions?.preview?.url
    const classNameCols = size
      ? size === 'big'
        ? 'offset-md-1 col-md-10'
        : 'offset-md-3 col-md-6'
      : ''
    return (
      <div className={`${className} ${classNameCols}`}>
        <DocLink className="no-link" slugOrId={doc.document_id}>
          <img
            alt={doc.data.title}
            src={imagePreviewUrl}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <Caption year={doc.data.year} type={doc.type} caption={caption} />
        </DocLink>
      </div>
    )
  } else if (doc.type === 'video') {
    const videoUrl = doc.url ? doc.url : doc.data.translated_urls
    // TODO: Handle subs
    // doc.data.subtitles
    return (
      <div className={`${className} offset-md-1 col-md-10`}>
        <video
          src={videoUrl}
          controls
          style={{ width: '100%', height: 'auto', objectFit: 'fill' }}
        />
        <DocLink className="text-decoration-none" slugOrId={doc.document_id}>
          <Caption year={doc.data.year} type={doc.type} caption={caption} />
        </DocLink>
      </div>
    )
  } else if (doc.type === 'audio') {
    const audioUrl = doc.url ? doc.url : doc.attachment
    return (
      <div className={`${className} offset-md-1 col-md-10`}>
        {audioUrl && (
          <audio src={audioUrl} controls style={{ width: '100%' }} />
        )}
        <DocLink document={document}>
          <Caption year={doc.data.year} type={doc.type} caption={caption} />
        </DocLink>
      </div>
    )
  } else {
    return null
  }
}
