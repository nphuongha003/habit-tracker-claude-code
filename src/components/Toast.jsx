import { useEffect, useState } from 'react'
import { CheckCircle2, Trash2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle2,
  error: Trash2,
  info: Info,
}
const colors = {
  success: 'text-green-500',
  error: 'text-red-400',
  info: 'text-blue-400',
}

function ToastItem({ toast, onRemove }) {
  const [leaving, setLeaving] = useState(false)
  const Icon = icons[toast.type] ?? CheckCircle2

  const dismiss = () => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 220)
  }

  useEffect(() => {
    const t = setTimeout(dismiss, toast.duration ?? 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[240px] max-w-[320px]',
        'bg-[var(--bg)] border border-[var(--bd)]',
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      )}
    >
      <Icon className={cn('w-4 h-4 shrink-0', colors[toast.type])} />
      <p className="text-sm text-[var(--tx)] flex-1">{toast.message}</p>
      <button
        onClick={dismiss}
        className="p-0.5 rounded hover:bg-[var(--bgh)] transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5 text-[var(--tx2)]" />
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}
