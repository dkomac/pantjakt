import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createPinIcon } from '../../lib/leafletIcons'

const pinIcon = createPinIcon()

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
