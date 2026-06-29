import { cn } from '@/lib/utils'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

function generateHeatmapData() {
  const weeks = []
  for (let w = 0; w < 26; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const r = Math.random()
      week.push(r > 0.35 ? (r > 0.7 ? (r > 0.88 ? 4 : 3) : 2) : r > 0.15 ? 1 : 0)
    }
    weeks.push(week)
  }
  return weeks
}

const heatmapData = generateHeatmapData()

const levelColors = [
  'bg-[var(--dv)]',
  'bg-violet-200 dark:bg-violet-900/60',
  'bg-violet-400 dark:bg-violet-700',
  'bg-violet-500 dark:bg-violet-600',
  'bg-violet-700 dark:bg-violet-500',
]

export default function HeatmapBlock() {
  return (
    <div className="bg-[var(--bg)] rounded-xl border border-[var(--bd)] p-5">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--tx)]">Activity Heatmap</h3>
          <p className="text-xs text-[var(--tx2)] mt-0.5">Last 6 months · All habits</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-[var(--tx2)]">Less</span>
          {levelColors.map((c, i) => (
            <div key={i} className={cn('w-3 h-3 rounded-sm', c)} />
          ))}
          <span className="text-xs text-[var(--tx2)]">More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((level, di) => (
                <div
                  key={di}
                  className={cn(
                    'w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-pointer',
                    levelColors[level]
                  )}
                  title={`${level} habit${level !== 1 ? 's' : ''} completed`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-0.5 mt-1.5">
          {months.map((m) => (
            <div key={m} className="w-[54px] shrink-0">
              <span className="text-[10px] text-[var(--tx2)]">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
