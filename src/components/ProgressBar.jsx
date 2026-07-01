export const CAT_COLORS = [
  'bg-orange-400', 'bg-blue-400', 'bg-yellow-400',
  'bg-purple-400', 'bg-cyan-400', 'bg-green-400', 'bg-pink-400',
]

export default function ProgressBar({ value, max, color = 'bg-violet-500' }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[var(--dv)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-[var(--tx2)] w-8 text-right tabular-nums">{pct}%</span>
    </div>
  )
}
