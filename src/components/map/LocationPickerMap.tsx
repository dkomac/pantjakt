import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createPinIcon } from '../../lib/leafletIcons'

const pinIcon = createPinIcon({ size: 22 })

interface Props {
  lat: number
  lon: number
  flyTarget: [number, number] | null
  onChange: (lat: number, lon: number) => void
}

function ClickHandler({ onChange }: { onChange: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 16, { duration: 1.2 })
  }, [target, map])
  return null
}

export function LocationPickerMap({ lat, lon, flyTarget, onChange }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      <ClickHandler onChange={onChange} />
      <FlyTo target={flyTarget} />
      <Marker
        position={[lat, lon]}
        icon={pinIcon}
        draggable
        eventHandlers={{
          dragend(e) {
            const { lat: newLat, lng: newLon } = e.target.getLatLng()
            onChange(newLat, newLon)
          },
        }}
      />
    </MapContainer>
  )
}
