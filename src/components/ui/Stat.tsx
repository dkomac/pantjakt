interface StatProps {
  label: string
  value: string
  highlight?: boolean
}

export function Stat({ label, value, highlight }: StatProps) {
  return (
    <div className="rounded-xl bg-gray-50 px-3.5 py-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-emerald-600' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  )
}
