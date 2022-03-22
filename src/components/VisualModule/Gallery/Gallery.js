import { memo } from 'react'
import Carousel from 'nuka-carousel'
import { ArrowLeft, ArrowRight } from 'react-feather'
import DocLink from '../../DocLink'
import Caption from '../Caption'
import './Gallery.css'

const GalleryItem = memo(({ document }) => {
  return (
    <DocLink className="d-flex flex-column" document={document}>
      <img
        src={document.data.resolutions.preview.url}
        alt={document.data.title}
        style={{ maxWidth: '100%' }}
        className="customCursor"
      />
    </DocLink>
  )
})

export default function Gallery({ objects, caption }) {
  const settings = {
    heightMode: 'max',
    slideWidth: 0.8,
    cellSpacing: 15,
    wrapAround: true,
  }
  return (
    <div className="my-4">
      <Carousel
        {...settings}
        renderCenterLeftControls={({ previousSlide }) => (
          <button
            className="btn btn-icon-round btn-primary ml-2"
            onClick={previousSlide}
          >
            <ArrowLeft />
          </button>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <button
            className="btn btn-icon-round btn-primary mr-2"
            onClick={nextSlide}
          >
            <ArrowRight />
          </button>
        )}
        renderBottomCenterControls={null}
      >
        {objects.map(
          (o) =>
            o.document.data.resolutions && (
              <GalleryItem key={o.document.id} document={o.document} />
            )
        )}
      </Carousel>
      {caption && (
        <div>
          <Caption caption={caption} />
        </div>
      )}
    </div>
  )
}