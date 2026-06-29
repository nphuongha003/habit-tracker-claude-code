import { cn } from '@/lib/utils'

export default function StreakCard({ label, value, subtext, icon: Icon, gradient, iconColor }) {
  return (
    <div className={cn('rounded-xl p-4 flex flex-col gap-2 overflow-hidden', gradient)}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--tx2)] uppercase tracking-wide truncate">{label}</p>
          <p className="text-xl font-bold text-[var(--tx)] mt-1 tabular-nums">{value}</p>
          <p className="text-xs text-[var(--tx2)] mt-0.5 truncate">{subtext}</p>
        </div>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-2', iconColor)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}
