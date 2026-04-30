import { useAuth } from '../auth/useAuth'
import { useMyPickups } from './usePickupQueries'
import { PickupCard } from './components/PickupCard'
import { Spinner } from '../../components/ui/Spinner'

export function MyPickupsPage() {
  const { user } = useAuth()
  const { data, isLoading, error } = useMyPickups(user?.id)

  if (isLoading) return <Spinner className="mt-20" />
  if (error) return <p className="text-red-600 p-4">Kunde inte ladda dina hämtningar.</p>

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Hämtningar jag lagt ut</h2>
        {(!data?.donated || data.donated.length === 0) ? (
          <p className="text-sm text-gray-400">Du har inte lagt ut några hämtningar ännu.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.donated.map((p) => <PickupCard key={p.id} pickup={p} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Hämtningar jag bokat</h2>
        {(!data?.claimed || data.claimed.length === 0) ? (
          <p className="text-sm text-gray-400">Du har inte bokat några hämtningar ännu.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.claimed.map((p) => <PickupCard key={p.id} pickup={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
