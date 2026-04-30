import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PickupMap } from './PickupMap'
import { StatusBadge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { formatSEK, formatDateShort } from '../../lib/formatters'
import { useAvailablePickups } from '../pickups/usePickupQueries'
import { ROUTES } from '../../lib/routes'

export function MapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { data: pickups, isLoading, error } = useAvailablePickups()

  return (
    <div className="relative" style={{ height: 'calc(100vh - 56px)' }}>
      {isLoading ? (
        <div className="h-full flex items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-gray-400">Kunde inte ladda kartan.</p>
        </div>
      ) : (
        <PickupMap pickups={pickups ?? []} />
      )}

      <div
        className={`absolute top-4 left-4 bottom-4 z-[1000] flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-10'
        }`}
      >
        {sidebarOpen ? (
          <div className="flex flex-col h-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                {pickups?.length ?? 0} hämtningar
              </p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ←
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {(pickups ?? []).map((p) => (
                <Link
                  key={p.id}
                  to={ROUTES.pickup(p.id)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                      🥤
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.can_count} st · {formatSEK(p.estimated_value)}</p>
                    <p className="text-xs text-gray-400 truncate">{formatDateShort(p.pickup_window_start)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}

              {(pickups ?? []).length === 0 && !isLoading && (
                <div className="px-4 py-8 text-center">
                  <p className="text-2xl mb-2">🥤</p>
                  <p className="text-xs text-gray-400">Inga hämtningar just nu</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg ring-1 ring-gray-100 text-gray-500 hover:text-gray-900 transition-colors text-sm font-bold"
          >
            →
          </button>
        )}
      </div>
    </div>
  )
}
