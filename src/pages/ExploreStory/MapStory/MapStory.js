import { useDocument } from '@c2dh/react-miller'
import classNames from 'classnames'
import MapGL, { Marker, Popup } from '@urbica/react-map-gl'
import Cluster from '@urbica/react-map-gl-cluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { Spinner } from 'reactstrap'
import styles from './MapStory.module.css'

const ClusterMarker = ({ longitude, latitude, pointCount }) => (
  <Marker longitude={longitude} latitude={latitude}>
    <div className={styles.clusterMarker}>{pointCount}</div>
  </Marker>
)

function SideDocRelated({ docId }) {
  const [mainDoc] = useDocument(docId)

  return (
    <>
      {mainDoc.documents.map((doc) => (
        <div key={doc.id}>{doc.data.title}</div>
      ))}
    </>
  )
}

function SideDoc({ doc, onClose }) {
  return (
    <div>
      <h4>{doc.data.title}</h4>
      <img src={doc.attachmet} alt="Da Doc" />
      <div>{doc.document_id}</div>
      <button onClick={onClose}>C L O S E</button>
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

  const millerModule = story.data.chapters[0].contents.modules[0]

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
          document: { ...obj.document, document_id: 99 },
        }))
    )
  }, [millerModule])

  const [selectedDoc, setSelectedDoc] = useState(null)
  const handleSideDocClose = useCallback(() => setSelectedDoc(null), [])

  const [hoverDoc, setHoverDoc] = useState(null)

  return (
    <div className="h-100 w-100 d-flex flex-column">
      <div className="flex-1 d-flex" style={{ overflow: 'hidden' }}>
        <div className="h-100" style={{ width: 400 }}>
          {selectedDoc ? (
            <SideDoc doc={selectedDoc} onClose={handleSideDocClose} />
          ) : (
            <div>{millerModule.text.content}</div>
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
              longitude={+hoverDoc.data.coordinates.geometry.coordinates[1]}
              latitude={+hoverDoc.data.coordinates.geometry.coordinates[0]}
              closeButton={false}
              closeOnClick={false}
              anchor="right"
              offset={{
                right: [-10, 0],
              }}
            >
              <div className='text-black'>{hoverDoc.data.title}</div>
            </Popup>
          )}
        </MapGL>
      </div>
      <div className="bg-white text-black" style={{ height: 50 }}>
        Footer
      </div>
    </div>
  )
}
