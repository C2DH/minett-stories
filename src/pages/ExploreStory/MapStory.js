import MapGL from '@urbica/react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState } from 'react'

export default function MapStory({ story }) {
  const [viewport, setViewport] = useState({
    longitude: 6.087,
    latitude: 49.667,
    zoom: 8,
  })
  return (
    <div className="h-100 w-100 d-flex flex-column">
      <div className="flex-1 d-flex" style={{ overflow: 'hidden' }}>
        <div className="h-100" style={{ width: 200 }}>
          Giova From The Space
        </div>
        <MapGL
          {...viewport}
          onViewportChange={setViewport}
          style={{ width: '100%', height: '100%' }}
          maxZoom={16}
          minZoom={7.5}
          accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/175post/ck2abmbmf04391cn623ruh659"
        />
      </div>
      <div className='bg-white text-black' style={{ height: 50 }}>Footer</div>
    </div>
  )
}
