import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 22px;
    height: 22px;
    background: #10b981;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0,0,0,0.25);
  "></div>`,
  iconAnchor: [11, 11],
  iconSize: [22, 22],
})

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
