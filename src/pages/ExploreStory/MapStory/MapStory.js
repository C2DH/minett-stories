import { useDocument } from '@c2dh/react-miller'
import classNames from 'classnames'
import MapGL, { Marker, Popup } from '@urbica/react-map-gl'
import Cluster from '@urbica/react-map-gl-cluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { Spinner } from 'reactstrap'
import styles from './MapStory.module.css'
import LangLink from '../../../components/LangLink'
import { ArrowDown, ArrowLeft, X } from 'react-feather'
import VisualModule from '../../../components/VisualModule'

const ClusterMarker = ({ longitude, latitude, pointCount }) => (
  <Marker longitude={longitude} latitude={latitude}>
    <div className={styles.clusterMarker}>{pointCount}</div>
  </Marker>
)

function SideDocRelated({ docId }) {
  const [mainDoc] = useDocument(docId)

  const imageUrl =
    mainDoc.data.resolutions?.thumbnail.url ??
    mainDoc.snapshot ??
    mainDoc.attachment

  return (
    <>
      {mainDoc.documents.map((doc) => (
        <div className="border-bottom mt-2 pb-2">
          <h4 className={styles.Title}>{doc.data.title}</h4>
          <img src={imageUrl} alt={doc.data.title} />
          <div className={styles.Year}>{doc.data.year}</div>
          <div className={styles.Description}>{doc.data.description}</div>
          <LangLink className="no-link" to={`/document/${doc.id}`}>
            <div className="d-flex justify-content-end">
              <div className={styles.ButtonDocument}>TAKE ME THERE</div>
            </div>
          </LangLink>
        </div>
      ))}
    </>
  )
}

function SideDoc({ doc, onClose }) {
  const imageUrl =
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment
  return (
    <div className={styles.SideDoc}>
      <div className="d-flex justify-content-end">
        <div
          style={{ backgroundColor: 'var(--dark-grey)' }}
          className="btn-circle cursor-pointer"
          onClick={onClose}
        >
          <X color="white" />
        </div>
      </div>
      <h4 className={styles.Title}>{doc.data.title}</h4>
      <img src={imageUrl} alt={doc.data.title} />
      <div className={styles.Year}>{doc.data.year}</div>
      <div className={styles.Description}>{doc.data.description}</div>
      <LangLink className="no-link" to={`/document/${doc.document_id}`}>
        <div className="d-flex justify-content-end cursor-pointer">
          <div className={styles.ButtonDocument}>TAKE ME THERE</div>
        </div>
      </LangLink>
      <Suspense
        fallback={
          <div className="text-center py-2">
            <Spinner color="white" />
          </div>
        }
      >
        <SideDocRelated docId={doc.document_id} />
      </Suspense>
    </div>
  )
}

export default function MapStory({ story }) {
  const [viewport, setViewport] = useState({
    longitude: 6.087,
    latitude: 49.667,
    zoom: 8,
  })
  console.log('>', story)
  const millerModule = story.data.chapters[0].contents.modules[0]

  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]

  // NOTE: Ya as other modules this paths sucks...
  // But i am litle less scare cause we handle runtime erros
  const mapObjects = useMemo(() => {
    return (
      millerModule.map.objects
        .filter(
          (o) => o.document.data.coordinates.geometry.coordinates.length === 2
        )
        // FIXME: THIS IS AN HACK 2 TEST RELATED STUFF!!!
        .map((obj) => ({
          ...obj,
          document: {
            ...obj.document,
            attachment:
              '/media/image/snapshots/ch14-33-Portraet-Batty-Weber-72-0-260-0.jpg',
            document_id: 99,
          },
        }))
    )
  }, [millerModule])

  const [selectedDoc, setSelectedDoc] = useState(null)
  const handleSideDocClose = useCallback(() => setSelectedDoc(null), [])

  const [hoverDoc, setHoverDoc] = useState(null)

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

  return (
    <>
      <div className="h-100 w-100 d-flex flex-column">
        <div
          className="flex-1 d-flex flex-column flex-md-row"
          style={{ overflow: 'hidden' }}
        >
          <div>
            {selectedDoc ? (
              <SideDoc doc={selectedDoc} onClose={handleSideDocClose} />
            ) : (
              <div className={`${styles.BlockInfo}`}>
                <LangLink
                  style={{
                    backgroundColor: 'var(--dark-grey)',
                  }}
                  to={`/story/${story.slug}`}
                  className={'btn-circle cursor-pointer no-link'}
                >
                  <ArrowLeft />
                </LangLink>
                <div className={styles.TextContent}>
                  {millerModule.text.content}
                </div>
              </div>
            )}
          </div>
          <MapGL
            {...viewport}
            onViewportChange={setViewport}
            style={{ width: '100%', height: '100%' }}
            maxZoom={16}
            minZoom={7.5}
            accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/175post/ck2abmbmf04391cn623ruh659"
          >
            <Cluster
              maxZoom={11}
              radius={40}
              extent={512}
              nodeSize={64}
              component={ClusterMarker}
            >
              {mapObjects.map((obj) => {
                const isSelected = obj.document.id === selectedDoc?.id
                const key = String(obj.id) + (isSelected ? ':s' : '')
                return (
                  <Marker
                    onClick={() => setSelectedDoc(obj.document)}
                    key={key}
                    longitude={
                      +obj.document.data.coordinates.geometry.coordinates[1]
                    }
                    latitude={
                      +obj.document.data.coordinates.geometry.coordinates[0]
                    }
                  >
                    <div
                      onMouseEnter={() => setHoverDoc(obj.document)}
                      onMouseLeave={() =>
                        setHoverDoc((hDoc) =>
                          hDoc?.id === obj.document.id ? null : hDoc
                        )
                      }
                      className={classNames(styles.marker, {
                        [styles.selected]: isSelected,
                      })}
                    />
                  </Marker>
                )
              })}
            </Cluster>
            {hoverDoc && (
              <Popup
                // maxWidth="310"
                longitude={+hoverDoc.data.coordinates.geometry.coordinates[1]}
                latitude={+hoverDoc.data.coordinates.geometry.coordinates[0]}
                closeButton={false}
                closeOnClick={false}
                anchor="right"
                offset={{
                  right: [
                    selectedDoc && selectedDoc.id === hoverDoc.id ? -30 : -10,
                    0,
                  ],
                }}
              >
                <img
                  className="img-fluid"
                  src={hoverDoc.attachment}
                  alt={hoverDoc.data.title}
                />
                <div className={styles.TitlePopup}>{hoverDoc.data.title}</div>
                <div className={styles.YearPopup}>{hoverDoc.data.year}</div>
              </Popup>
            )}
          </MapGL>
        </div>
        <div
          className="bg-white text-black d-flex align-items-center"
          style={{ height: 50 }}
        >
          {!goDeeper && (
            <div
              onClick={onGoDeeper}
              style={{ position: 'absolute', left: 0 }}
              className="w-100 d-flex justify-content-center cursor-pointer"
            >
              <div
                className={`text-color-story-map d-flex flex-row align-items-center`}
              >
                <span className="d-none d-md-block">Go deeper (10 min.)</span>
                <ArrowDown className="ms-0" color={`var(--color-story-map)`} />
              </div>
            </div>
          )}
        </div>
      </div>
      {goDeeper && (
        <div className="bg-white ps-3 pe-3 ps-md-0 pe-md-0">
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </>
  )
}
