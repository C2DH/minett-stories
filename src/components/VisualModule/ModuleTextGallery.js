import Gallery from './Gallery'
import ReactMarkdown from 'react-markdown'

export default function ModuleTextGallery({ millerModule }) {
  if (millerModule.layout === 'gallery-text') {
    return (
      <div>
        <Gallery
          objects={millerModule.gallery.objects}
          caption={millerModule.gallery.caption}
        />

        <ReactMarkdown skipHtml={true}>
          {millerModule.text.content}
        </ReactMarkdown>
      </div>
    )
  } else {
    return (
      <div>
        <ReactMarkdown skipHtml={true}>
          {millerModule.text.content}
        </ReactMarkdown>
        <Gallery
          objects={millerModule.gallery.objects}
          caption={millerModule.gallery.caption}
        />
      </div>
    )
  }
}
