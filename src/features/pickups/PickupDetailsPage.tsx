import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { Stat } from '../../components/ui/Stat'
import { formatSEK, formatDate } from '../../lib/formatters'
import { toast } from '../../lib/toastStore'
import { MiniMap } from '../../components/map/MiniMap'
import { usePickup, usePickupMutations } from './usePickupQueries'
import { ROUTES } from '../../lib/routes'

export function PickupDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: pickup, isLoading, error } = usePickup(id)
  const { claim, complete, cancel } = usePickupMutations(id)

  if (isLoading) return <Spinner className="mt-20" />
  if (error || !pickup) return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-gray-400 text-sm">Hämtningen hittades inte.</p>
    </div>
  )

  const isDonor = user?.id === pickup.donor_id
  const isCollector = user?.id === pickup.collector_id

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5"
      >
        ← Tillbaka
      </button>

      <div className="card overflow-hidden">
        {pickup.image_url ? (
          <img src={pickup.image_url} alt={pickup.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-6xl">
            🥤
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{pickup.title}</h1>
            <StatusBadge status={pickup.status} />
          </div>

          {pickup.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-5">{pickup.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat label="Burkar / flaskor" value={`${pickup.can_count} st`} />
            <Stat label="Uppskattat pantsvärde" value={formatSEK(pickup.estimated_value)} highlight />
            <Stat label="Hämtfönster start" value={formatDate(pickup.pickup_window_start)} />
            <Stat label="Hämtfönster slut" value={formatDate(pickup.pickup_window_end)} />
            <div className="col-span-2">
              <Stat label="Adress" value={pickup.address} />
            </div>
            {pickup.instructions && (
              <div className="col-span-2">
                <Stat label="Instruktioner" value={pickup.instructions} />
              </div>
            )}
            <Stat label="Donator" value={pickup.donor?.display_name ?? pickup.donor?.email ?? '–'} />
            {pickup.collector && (
              <Stat label="Insamlare" value={pickup.collector.display_name ?? pickup.collector.email ?? '–'} />
            )}
          </div>

          <div className="mb-5 rounded-2xl overflow-hidden h-44 ring-1 ring-gray-100">
            <MiniMap lat={pickup.latitude} lon={pickup.longitude} />
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {pickup.status === 'available' && !isDonor && (
              <Button onClick={() => claim.mutate(user!.id)} loading={claim.isPending}>
                Boka hämtning
              </Button>
            )}
            {pickup.status === 'claimed' && isCollector && (
              <Button onClick={() => complete.mutate()} loading={complete.isPending}>
                Markera som hämtad
              </Button>
            )}
            {isDonor && (pickup.status === 'available' || pickup.status === 'claimed') && (
              <Button
                variant="danger"
                loading={cancel.isPending}
                onClick={() =>
                  cancel.mutate(undefined, {
                    onSuccess: () => {
                      toast.info('Hämtning avbruten.')
                      navigate(ROUTES.pickups)
                    },
                  })
                }
              >
                Avbryt hämtning
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
