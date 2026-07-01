import { cn } from '@/lib/utils'

// w-3 (12px) + gap-0.5 (2px) = 14px per week column
const CELL_W = 14

function computeStartDate() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(today.getDate() - 26 * 7 + 1)
  const dow = start.getDay()
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1))
  return start
}

function buildMonthLabels(startDate, numWeeks = 26) {
  const labels = []
  const cur = new Date(startDate)
  let lastMonth = -1
  for (let w = 0; w < numWeeks; w++) {
    const m = cur.getMonth()
    if (m !== lastMonth) {
      labels.push({ text: cur.toLocaleString('en-US', { month: 'short' }), week: w })
      lastMonth = m
    }
    cur.setDate(cur.getDate() + 7)
  }
  return labels
}

const levelColors = [
  'bg-[var(--dv)]',
  'bg-violet-200 dark:bg-violet-900/60',
  'bg-violet-400 dark:bg-violet-700',
  'bg-violet-500 dark:bg-violet-600',
  'bg-violet-700 dark:bg-violet-500',
]

export default function HeatmapBlock({ data }) {
  const startDate = computeStartDate()
  const monthLabels = buildMonthLabels(startDate)
  const heatmapData = data ?? []

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
        <div className="flex mt-1.5">
          {monthLabels.map((label, i) => {
            const nextWeek = monthLabels[i + 1]?.week ?? 26
            return (
              <div key={i} style={{ width: `${(nextWeek - label.week) * CELL_W}px` }} className="shrink-0">
                <span className="text-[10px] text-[var(--tx2)]">{label.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
