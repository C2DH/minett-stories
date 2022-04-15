import MapGL, { Marker } from '@urbica/react-map-gl'
import Cluster from '@urbica/react-map-gl-cluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMemo, useState } from 'react'

const style = {
  width: '20px',
  height: '20px',
  color: '#fff',
  background: '#1978c8',
  borderRadius: '20px',
  textAlign: 'center',
}

const ClusterMarker = ({ longitude, latitude, pointCount }) => (
  <Marker longitude={longitude} latitude={latitude}>
    <div style={{ ...style, background: '#f28a25' }}>{pointCount}</div>
  </Marker>
)

function SideDoc({ doc }) {
  return (
    <div>
      <h4>{doc.data.title}</h4>
      <img src={doc.attachmet} alt="Da Doc" />
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
    return millerModule.map.objects.filter(
      (o) => o.document.data.coordinates.geometry.coordinates.length === 2
    )
  }, [millerModule])

  const [selectedDoc, setSelectedDoc] = useState(null)

  return (
    <div className="h-100 w-100 d-flex flex-column">
      <div className="flex-1 d-flex" style={{ overflow: 'hidden' }}>
        <div className="h-100" style={{ width: 400 }}>
          {selectedDoc ? (
            <SideDoc doc={selectedDoc} />
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
            {mapObjects.map((obj) => (
              <Marker
                onClick={() => setSelectedDoc(obj.document)}
                key={obj.id}
                longitude={
                  +obj.document.data.coordinates.geometry.coordinates[1]
                }
                latitude={
                  +obj.document.data.coordinates.geometry.coordinates[0]
                }
              >
                <div style={style} />
              </Marker>
            ))}
          </Cluster>
        </MapGL>
      </div>
      <div className="bg-white text-black" style={{ height: 50 }}>
        Footer
      </div>
    </div>
  )
}
