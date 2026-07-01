import StreakCard from '@/components/StreakCard'
import HeatmapBlock from '@/components/HeatmapBlock'
import ProgressBar, { CAT_COLORS } from '@/components/ProgressBar'
import { buildHeatmapData } from '@/lib/heatmap'

export default function AnalyticsView({ derivedHabits, stats }) {
  const doneCount = derivedHabits.filter((h) => h.doneToday).length
  const totalCount = derivedHabits.length
  const donePct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)
  const remaining = totalCount - doneCount

  const catMap = {}
  for (const h of derivedHabits) {
    const cat = h.category || 'General'
    if (!catMap[cat]) catMap[cat] = { done: 0, total: 0 }
    catMap[cat].total++
    if (h.doneToday) catMap[cat].done++
  }
  const categories = Object.entries(catMap)

  const allDates = derivedHabits.flatMap((h) => h.history || [])
  const heatmapData = buildHeatmapData(allDates)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s) => (
          <StreakCard key={s.label} {...s} />
        ))}
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium opacity-90">Daily Progress</p>
            <p className="text-lg sm:text-xl font-bold mt-0.5">
              {doneCount} of {totalCount} habits done
            </p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-lg sm:text-xl font-bold tabular-nums">{donePct}%</span>
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${donePct}%` }}
          />
        </div>
        <p className="text-xs opacity-75 mt-2">
          {remaining === 0 ? 'All done for today! 🎉' : `${remaining} more to go 💪`}
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--tx)] mb-3">Category Progress</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-[var(--tx2)]">No habits yet.</p>
        ) : (
          <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] divide-y divide-[var(--dv)]">
            {categories.map(([name, { done, total }], i) => (
              <div key={name} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--tx)]">{name}</span>
                  <span className="text-xs text-[var(--tx2)] tabular-nums">
                    {done}/{total}
                  </span>
                </div>
                <ProgressBar value={done} max={total} color={CAT_COLORS[i % CAT_COLORS.length]} />
              </div>
            ))}
          </div>
        )}
      </div>

      <HeatmapBlock data={heatmapData} />
    </div>
  )
}
