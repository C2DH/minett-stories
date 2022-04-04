import { memo } from 'react'
import Carousel from 'nuka-carousel'
import { ChevronLeft, ChevronRight } from 'react-feather'
import DocLink from '../../DocLink'
import Caption from '../Caption'
import './Gallery.css'

const GalleryItem = memo(({ document }) => {
  return (
    <DocLink className="d-flex flex-column" slugOrId={document.document_id}>
      <img
        src={document.data.resolutions.preview.url}
        alt={document.data.title}
        // style={{ maxWidth: '100%' }}
        className="customCursor"
      />
    </DocLink>
  )
})

export default function Gallery({ objects, caption }) {
  const settings = {
    slidesToShow: 2,
    heightMode: 'max',
    // height: 'max',
    cellSpacing: 15,
    wrapAround: true,
    initialSlideHeight: 300
  }
  return (
    <div className="my-4 row">
      <div className='offset-md-1 col-md-10'>
        <Carousel
          {...settings}
          renderCenterLeftControls={({ previousSlide }) => (
            <div
              className="btn-circle bg-dark cursor-pointer"
              onClick={previousSlide}
            >
              <ChevronLeft size={15} />
            </div>
          )}
          renderCenterRightControls={({ nextSlide }) => (
            <div
              className="btn-circle bg-dark cursor-pointer"
              onClick={nextSlide}
            >
              <ChevronRight size={15} />
            </div>
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
    </div>
  )
}
