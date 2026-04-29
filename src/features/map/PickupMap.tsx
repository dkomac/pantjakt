import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Pickup } from '../../lib/database.types'
import { PickupMarker } from './PickupMarker'
import { STOCKHOLM } from '../../lib/geo'

interface PickupMapProps {
  pickups: Pickup[]
}

export function PickupMap({ pickups }: PickupMapProps) {
  return (
    <MapContainer center={STOCKHOLM} zoom={13} className="h-full w-full" zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      {pickups.map((p) => (
        <PickupMarker key={p.id} pickup={p} />
      ))}
    </MapContainer>
  )
}
