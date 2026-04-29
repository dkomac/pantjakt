import { useToastStore } from '../../lib/toastStore'
import type { Toast, ToastType } from '../../lib/toastStore'

const config: Record<ToastType, { icon: string; bar: string; iconBg: string }> = {
  success: { icon: '✓', bar: 'bg-emerald-500', iconBg: 'bg-emerald-500' },
  error:   { icon: '✕', bar: 'bg-red-500',     iconBg: 'bg-red-500'     },
  info:    { icon: 'i', bar: 'bg-blue-500',     iconBg: 'bg-blue-500'    },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const { icon, bar, iconBg } = config[toast.type]
  return (
    <div className="relative overflow-hidden flex items-start gap-3 w-80 rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 px-4 py-3.5">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${iconBg} text-white text-xs font-bold`}>
        {icon}
      </span>
      <p className="flex-1 text-sm text-gray-700 leading-snug">{toast.message}</p>
      <button onClick={onRemove} className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none mt-0.5">
        ×
      </button>
      <span className={`absolute bottom-0 left-0 h-0.5 ${bar} animate-[shrink_4s_linear_forwards]`} style={{ width: '100%' }} />
    </div>
  )
}

export function Toaster() {
  const { toasts, remove } = useToastStore()
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />
      ))}
    </div>
  )
}
