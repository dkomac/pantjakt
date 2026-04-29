import type { PickupStatus } from '../../lib/database.types'

const statusConfig: Record<PickupStatus, { label: string; classes: string }> = {
  available: { label: 'Tillgänglig', classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  claimed:   { label: 'Bokad',       classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  completed: { label: 'Hämtad',      classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  cancelled: { label: 'Avbruten',    classes: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200' },
}

export function StatusBadge({ status }: { status: PickupStatus }) {
  const { label, classes } = statusConfig[status]
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${classes}`}>
      {label}
    </span>
  )
}
