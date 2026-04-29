import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 18px;
    height: 18px;
    background: #10b981;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  "></div>`,
  iconAnchor: [9, 9],
  iconSize: [18, 18],
})

interface MiniMapProps {
  lat: number
  lon: number
}

export function MiniMap({ lat, lon }: MiniMapProps) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={15}
      className="h-full w-full"
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <Marker position={[lat, lon]} icon={pinIcon} />
    </MapContainer>
  )
}
