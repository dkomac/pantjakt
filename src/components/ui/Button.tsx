import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  children: ReactNode
}

const variantStyles = {
  primary:   'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow disabled:bg-emerald-200 disabled:shadow-none',
  secondary: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 shadow-sm disabled:opacity-50',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm disabled:bg-red-200',
  ghost:     'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
