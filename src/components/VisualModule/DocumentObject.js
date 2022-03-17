import DocLink from '../DocLink'
import Caption from './Caption'

export default function DocumentObject({ doc, caption, className }) {
  if (doc.type === 'image' || doc.type === 'pdf') {
    const imagePreviewUrl = doc.data.resolutions?.preview?.url
    return (
      <div className={className}>
        <DocLink slugOrId={doc.document_id}>
          <img
            alt={doc.data.title}
            src={imagePreviewUrl}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <Caption caption={caption} />
        </DocLink>
      </div>
    )
  } else if (doc.type === 'video') {
    const videoUrl = doc.url ? doc.url : doc.data.translated_urls
    // TODO: Handle subs
    // doc.data.subtitles
    return (
      <div className={className}>
        <video
          src={videoUrl}
          controls
          style={{ width: '100%', height: 'auto', objectFit: 'fill' }}
        />
        <DocLink slugOrId={doc.document_id}>
          <Caption caption={caption} />
        </DocLink>
      </div>
    )
  } else if (doc.type === 'audio') {
    const audioUrl = doc.url ? doc.url : doc.attachment
    return (
      <div className={className}>
        {audioUrl && <audio src={audioUrl} controls style={{ width: '100%' }} />}
        <DocLink document={document}>
          <Caption caption={caption} />
        </DocLink>
      </div>
    )
  } else {
    return null
  }
}
