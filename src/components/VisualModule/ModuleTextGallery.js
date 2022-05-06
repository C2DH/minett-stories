import Gallery from './Gallery'
import ReactMarkdown from 'react-markdown'

export default function ModuleTextGallery({ millerModule }) {
  if (millerModule.layout === 'gallery-text') {
    return (
      <div className="row">
        <div className='col-md-12'>
          <Gallery
            objects={millerModule.gallery.objects}
            caption={millerModule.gallery.caption}
          />
        </div>
        <div className="text-black offset-md-3 col-md-6 mt-2 mb-2">
          <ReactMarkdown
            className="text-object-story text-black"
            skipHtml={true}
          >
            {millerModule.text.content}
          </ReactMarkdown>
        </div>
      </div>
    )
  } else {
    return (
      <div className="row">
        <div className="text-black offset-md-3 col-md-6 mt-2 mb-2">
          <ReactMarkdown className="text-object-story" skipHtml={true}>
            {millerModule.text.content}
          </ReactMarkdown>
        </div>
        <div className="col-md-12">
          <Gallery
            objects={millerModule.gallery.objects}
            caption={millerModule.gallery.caption}
          />
        </div>
      </div>
    )
  }
}
