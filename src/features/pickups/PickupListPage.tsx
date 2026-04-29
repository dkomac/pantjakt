import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { fetchAvailablePickups } from './pickupService'
import { PickupCard } from './components/PickupCard'
import { Spinner } from '../../components/ui/Spinner'
import { haversineKm } from '../../lib/geo'
import type { SortOption } from './pickupTypes'
import type { Pickup } from '../../lib/database.types'

export function PickupListPage() {
  const [sort, setSort] = useState<SortOption>('newest')
  const [userPos, setUserPos] = useState<GeolocationCoordinates | null>(null)

  const { data: pickups, isLoading, error } = useQuery({
    queryKey: ['pickups', 'available'],
    queryFn: fetchAvailablePickups,
  })

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => setUserPos(pos.coords))
  }, [])

  function sortedPickups(list: Pickup[]): Pickup[] {
    switch (sort) {
      case 'value':
        return [...list].sort((a, b) => b.estimated_value - a.estimated_value)
      case 'distance':
        if (!userPos) return list
        return [...list].sort((a, b) =>
          haversineKm(userPos.latitude, userPos.longitude, a.latitude, a.longitude) -
          haversineKm(userPos.latitude, userPos.longitude, b.latitude, b.longitude),
        )
      default:
        return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  }

  const sorted = pickups ? sortedPickups(pickups) : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tillgängliga hämtningar</h1>
          {!isLoading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {sorted.length} {sorted.length === 1 ? 'hämtning' : 'hämtningar'} just nu
            </p>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="newest">Nyast</option>
          <option value="value">Högst värde</option>
          <option value="distance">Närmast</option>
        </select>
      </div>

      {isLoading && <Spinner className="mt-20" />}

      {error && (
        <div className="mt-10 text-center">
          <p className="text-red-500 text-sm">Kunde inte ladda hämtningar.</p>
        </div>
      )}

      {sorted.length === 0 && !isLoading && !error && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">🥤</span>
          <h2 className="text-lg font-semibold text-gray-700">Inga hämtningar just nu</h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Var den första att lägga ut pant i ditt område!
          </p>
          <RouterLink
            to="/create"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            + Lägg ut en hämtning
          </RouterLink>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((pickup) => (
          <PickupCard
            key={pickup.id}
            pickup={pickup}
            distanceKm={
              userPos
                ? haversineKm(userPos.latitude, userPos.longitude, pickup.latitude, pickup.longitude)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
