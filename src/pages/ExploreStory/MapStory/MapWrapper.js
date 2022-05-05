import classNames from 'classnames'
import MapGL, { Marker, Popup } from '@urbica/react-map-gl'
import Cluster from '@urbica/react-map-gl-cluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from './MapStory.module.css'
import { useState } from 'react'

const ClusterMarker = ({ longitude, latitude, pointCount }) => (
  <Marker longitude={longitude} latitude={latitude}>
    <div className={styles.clusterMarker}>{pointCount}</div>
  </Marker>
)

export default function MapWrapper({ mapObjects, selectedDoc, setSelectedDoc }) {
  const [viewport, setViewport] = useState({
    longitude: 5.918,
    latitude: 49.509,
    zoom: 10,
  })
  const [hoverDoc, setHoverDoc] = useState(null)
  return (
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
        maxZoom={0}
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
              longitude={+obj.document.data.coordinates.geometry.coordinates[1]}
              latitude={+obj.document.data.coordinates.geometry.coordinates[0]}
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
  )
}
