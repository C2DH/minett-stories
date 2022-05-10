import { memo } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { ChevronLeft, ChevronRight } from 'react-feather'
import DocLink from '../../DocLink'
import Caption from '../Caption'
import './Gallery.css'
import classNames from 'classnames'

const GalleryItem = memo(({ document }) => {
  return (
    <DocLink
      style={{ height: 'auto' }}
      className="d-flex flex-column me-0 me-md-3 no-link"
      slugOrId={document.slug}
    >
      <img
        src={document.data.resolutions.preview.url}
        alt={document.data.title}
        className="customCursor img-fluid"
      />
      {document.data.title && (
        <div className="no-link">
          <Caption
            type={document.type}
            year={document.data.year || document.data.date}
            caption={document.title}
          />
        </div>
      )}
    </DocLink>
  )
})

const CustomButtonGroup = ({ next, previous, objects, goToSlide, ...rest }) => {
  const {
    carouselState: { currentSlide },
  } = rest
  const lastImageIndex = objects.length - 1

  console.log(lastImageIndex, 'last')

  return (
    <div className="custom-button-group">
      {objects.length > 2 && (
        <>
          <div
            className={classNames(
              'prev-button btn-circle bg-dark cursor-pointer',
              {
                'opacity-50': currentSlide === 0,
              }
            )}
            onClick={() => previous()}
          >
            <ChevronLeft size={15} />
          </div>
          <div
            className={classNames(
              'next-button btn-circle bg-dark cursor-pointer',
              {
                'opacity-50': currentSlide === Math.ceil(lastImageIndex / 2),
              }
            )}
            onClick={() => next()}
          >
            <ChevronRight size={15} />
          </div>
        </>
      )}
    </div>
  )
}

export default function Gallery({ objects, caption }) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }
  return (
    <div className={`LightGrayBackground pt-4 ms-md-1 me-md-1 pb-4 my-4 row`}>
      <div className="offset-md-1 col-md-10 position-relative">
        <Carousel
          renderButtonGroupOutside={true}
          customButtonGroup={<CustomButtonGroup objects={objects} />}
          swipeable={false}
          arrows={false}
          autoPlay={false}
          containerClass={'flex-row align-items-end'}
          className={''}
          draggable={false}
          itemClass={'h-auto'}
          shouldResetAutoplay={false}
          infinite={false}
          showDots={false}
          responsive={responsive}
        >
          {objects.map(
            (o) =>
              o.document.data.resolutions && (
                <GalleryItem key={o.document.id} document={o.document} />
              )
          )}
        </Carousel>
      </div>
    </div>
  )
}
