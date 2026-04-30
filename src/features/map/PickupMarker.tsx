import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import type { Pickup } from '../../lib/database.types'
import { formatSEK } from '../../lib/formatters'
import { createPillIcon } from '../../lib/leafletIcons'
import { ROUTES } from '../../lib/routes'

export function PickupMarker({ pickup }: { pickup: Pickup }) {
  return (
    <Marker
      position={[pickup.latitude, pickup.longitude]}
      icon={createPillIcon(formatSEK(pickup.estimated_value))}
    >
      <Popup>
        <div className="w-52 p-3.5">
          {pickup.image_url && (
            <img src={pickup.image_url} alt={pickup.title} className="w-full h-28 object-cover rounded-lg mb-3" />
          )}
          <p className="font-semibold text-gray-900 text-sm leading-snug">{pickup.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">{pickup.can_count} burkar · {formatSEK(pickup.estimated_value)}</p>
          <Link
            to={ROUTES.pickup(pickup.id)}
            className="block text-center rounded-xl bg-emerald-500 text-white text-xs font-semibold py-2 hover:bg-emerald-600 transition-colors"
          >
            Visa detaljer →
          </Link>
        </div>
      </Popup>
    </Marker>
  )
}
