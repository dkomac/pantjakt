import { Link } from 'react-router-dom'
import type { Pickup } from '../../../lib/database.types'
import { StatusBadge } from '../../../components/ui/Badge'
import { formatSEK, formatDateShort } from '../../../lib/formatters'

interface PickupCardProps {
  pickup: Pickup
  distanceKm?: number
}

export function PickupCard({ pickup, distanceKm }: PickupCardProps) {
  return (
    <Link
      to={`/pickups/${pickup.id}`}
      className="group flex flex-col bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {pickup.image_url ? (
        <img
          src={pickup.image_url}
          alt={pickup.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-4xl">
          🥤
        </div>
      )}

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-emerald-600 transition-colors">
            {pickup.title}
          </h3>
          <StatusBadge status={pickup.status} />
        </div>

        {pickup.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{pickup.description}</p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{pickup.can_count} st</span>
            {distanceKm !== undefined && <span>{distanceKm.toFixed(1)} km</span>}
          </div>
          <span className="text-sm font-bold text-emerald-600">{formatSEK(pickup.estimated_value)}</span>
        </div>

        <div className="mt-2 text-xs text-gray-400 truncate">
          {formatDateShort(pickup.pickup_window_start)} – {formatDateShort(pickup.pickup_window_end)}
        </div>
      </div>
    </Link>
  )
}
