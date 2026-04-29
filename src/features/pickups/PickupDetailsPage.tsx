import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPickupById, claimPickup, completePickup, cancelPickup } from './pickupService'
import { useAuth } from '../auth/useAuth'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { formatSEK, formatDate } from '../../lib/formatters'
import { toast } from '../../lib/toastStore'

export function PickupDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: pickup, isLoading, error } = useQuery({
    queryKey: ['pickup', id],
    queryFn: () => fetchPickupById(id!),
    enabled: !!id,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['pickup', id] })
    qc.invalidateQueries({ queryKey: ['pickups'] })
  }

  const claimMutation = useMutation({
    mutationFn: () => claimPickup(id!, user!.id),
    onSuccess: () => { invalidate(); toast.success('Hämtning bokad!') },
    onError: () => toast.error('Kunde inte boka hämtningen.'),
  })

  const completeMutation = useMutation({
    mutationFn: () => completePickup(id!),
    onSuccess: () => { invalidate(); toast.success('Markerad som hämtad!') },
    onError: () => toast.error('Något gick fel.'),
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelPickup(id!),
    onSuccess: () => { invalidate(); toast.info('Hämtning avbruten.'); navigate('/pickups') },
    onError: () => toast.error('Kunde inte avbryta.'),
  })

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

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {pickup.status === 'available' && !isDonor && (
              <Button onClick={() => claimMutation.mutate()} loading={claimMutation.isPending}>
                Boka hämtning
              </Button>
            )}
            {pickup.status === 'claimed' && isCollector && (
              <Button onClick={() => completeMutation.mutate()} loading={completeMutation.isPending}>
                Markera som hämtad
              </Button>
            )}
            {isDonor && (pickup.status === 'available' || pickup.status === 'claimed') && (
              <Button variant="danger" onClick={() => cancelMutation.mutate()} loading={cancelMutation.isPending}>
                Avbryt hämtning
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3.5 py-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-emerald-600' : 'text-gray-800'}`}>{value}</p>
    </div>
  )
}
