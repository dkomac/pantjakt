import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import type { Pickup } from '../../lib/database.types'
import { formatSEK } from '../../lib/formatters'

function createPillIcon(value: number) {
  const label = formatSEK(value)
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: #10b981;
        color: white;
        font-family: Inter, system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 9px;
        border-radius: 20px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.20);
        border: 2px solid white;
        transform: translateX(-50%);
        display: inline-block;
      ">${label}</div>
    `,
    iconAnchor: [0, 8],
    popupAnchor: [0, -16],
  })
}

export function PickupMarker({ pickup }: { pickup: Pickup }) {
  return (
    <Marker
      position={[pickup.latitude, pickup.longitude]}
      icon={createPillIcon(pickup.estimated_value)}
    >
      <Popup>
        <div className="w-52 p-3.5">
          {pickup.image_url && (
            <img src={pickup.image_url} alt={pickup.title} className="w-full h-28 object-cover rounded-lg mb-3" />
          )}
          <p className="font-semibold text-gray-900 text-sm leading-snug">{pickup.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">{pickup.can_count} burkar · {formatSEK(pickup.estimated_value)}</p>
          <Link
            to={`/pickups/${pickup.id}`}
            className="block text-center rounded-xl bg-emerald-500 text-white text-xs font-semibold py-2 hover:bg-emerald-600 transition-colors"
          >
            Visa detaljer →
          </Link>
        </div>
      </Popup>
    </Marker>
  )
}

