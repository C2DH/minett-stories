import { useMemo } from 'react'
import DocLink from '../DocLink'
import Caption from './Caption'

function DocVideo({ doc, caption, className }) {
  const videoUrl = doc?.data?.streamingUrl ?? doc.url
  const subtitlesFile = useMemo(() => {
    // TODO: Re-enable when got the real vtt
    return '/vtt/test.vtt'
    // return (
    //   find(doc?.data?.subtitles ?? [], {
    //     language: i18n.language,
    //     availability: true,
    //     type: 'vtt',
    //   })?.url ?? null
    // )
  }, [])
  const dateToUse = useMemo(() => {
    if (doc.data.year) {
      return doc.data.year
    } else return doc.data.date
  }, [doc])
  return (
    <div className={`${className} offset-md-1 col-md-10`}>
      <video
        src={videoUrl}
        controls
        style={{ width: '100%', height: 'auto', objectFit: 'fill' }}
      >
        {subtitlesFile && (
          <track kind="subtitles" src={subtitlesFile} default />
        )}
      </video>
      <DocLink className="text-decoration-none" slugOrId={doc.document_id}>
        <Caption year={dateToUse} type={doc.type} caption={caption} />
      </DocLink>
    </div>
  )
}

export default function DocumentObject({ doc, caption, className, size }) {
  if (doc.type === 'image' || doc.type === 'pdf') {
    const imagePreviewUrl = doc.data.resolutions?.preview?.url
    const classNameCols = size
      ? size === 'big'
        ? 'offset-md-1 col-md-10'
        : 'offset-md-3 col-md-6'
      : ''
    const dateToUse = doc.data.year ? doc.data.year : doc.data.date
    console.log(doc)
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
          <Caption year={dateToUse} type={doc.type} caption={caption} />
        </DocLink>
      </div>
    )
  } else if (doc.type === 'video') {
    return <DocVideo doc={doc} caption={caption} className={className} />
  } else if (doc.type === 'audio') {
    const audioUrl = doc.url ? doc.url : doc.attachment
    const dateToUse = doc.data.year ? doc.data.year : doc.data.date
    return (
      <div className={`${className} offset-md-1 col-md-10`}>
        {audioUrl && (
          <audio src={audioUrl} controls style={{ width: '100%' }} />
        )}
        <DocLink document={document}>
          <Caption year={dateToUse} type={doc.type} caption={caption} />
        </DocLink>
      </div>
    )
  } else {
    return null
  }
}
