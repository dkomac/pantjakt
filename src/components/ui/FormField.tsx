import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}
