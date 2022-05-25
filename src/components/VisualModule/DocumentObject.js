import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import find from 'lodash/find'
import DocLink from '../DocLink'
import Caption from './Caption'

function DocVideo({ doc, caption, className, size }) {
  const { i18n } = useTranslation()
  const videoUrl = doc?.data?.streamingUrl ?? doc.url
  const subtitlesFile = useMemo(() => {
    return (
      find(doc?.data?.subtitles ?? [], {
        language: i18n.language,
        availability: true,
        type: 'vtt',
      })?.url ?? null
    )
  }, [doc?.data?.subtitles, i18n.language])
  const dateToUse = useMemo(() => {
    if (doc.data.year) {
      return doc.data.year
    } else return doc.data.date
  }, [doc])
  const classNameCols = size
      ? size === 'big'
        ? 'offset-gigaxl-2 col-gigaxl-8 offset-md-1 col-md-10'
        : 'offset-gigaxl-4 col-gigaxl-4 offset-md-3 col-md-6'
      : ''
  return (
    <div className={`${className} ${classNameCols}`}>
      <video
        playsinline
        src={videoUrl}
        controls
        style={{ width: '100%', height: 'auto', objectFit: 'fill' }}
      >
        {subtitlesFile && (
          <track kind="subtitles" src={subtitlesFile} default />
        )}
      </video>
      <DocLink prefetchOnOver className="text-decoration-none" slugOrId={doc.slug}>
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
        ? 'offset-gigaxl-2 col-gigaxl-8 offset-md-1 col-md-10'
        : 'offset-gigaxl-4 col-gigaxl-4 offset-md-3 col-md-6'
      : ''
    const dateToUse = doc.data.year ? doc.data.year : doc.data.date
    return (
      <div className={`${className} ${classNameCols}`}>
        <DocLink prefetchOnOver className="no-link" slugOrId={doc.slug}>
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
    return <DocVideo size={size} doc={doc} caption={caption} className={className} />
  } else if (doc.type === 'audio') {
    const audioUrl = doc.url ? doc.url : doc.attachment
    const dateToUse = doc.data.year ? doc.data.year : doc.data.date
    return (
      <div className={`${className} offset-gigaxl-2 col-gigaxl-8 offset-md-1 col-md-10`}>
        {audioUrl && (
          <audio src={audioUrl} controls style={{ width: '100%' }} />
        )}
        <DocLink prefetchOnOver slugOrId={document.slug}>
          <Caption year={dateToUse} type={doc.type} caption={caption} />
        </DocLink>
      </div>
    )
  } else {
    return null
  }
}
