import { Plus, Sparkles } from 'lucide-react'
import HabitRow from '@/components/HabitRow'
import WeekHeader from '@/components/WeekHeader'
import StreakCard from '@/components/StreakCard'
import HeatmapBlock from '@/components/HeatmapBlock'
import QuoteBlock from '@/components/QuoteBlock'
import ProgressBar, { CAT_COLORS } from '@/components/ProgressBar'
import { buildHeatmapData } from '@/lib/heatmap'

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-habit-enter">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-violet-500" />
      </div>
      <h3 className="text-base font-semibold text-[var(--tx)] mb-1">No habits yet</h3>
      <p className="text-sm text-[var(--tx2)] mb-5 max-w-xs">
        Start building better habits. Add your first one and begin your streak today.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--tx)] text-[var(--bg)] text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add your first habit
      </button>
    </div>
  )
}

export default function TodayView({
  filteredHabits,
  allDerivedHabits,
  newHabitId,
  deletingId,
  onToggleToday,
  onEdit,
  onDelete,
  onAdd,
  stats,
}) {
  const catMap = {}
  for (const h of allDerivedHabits) {
    const cat = h.category || 'General'
    if (!catMap[cat]) catMap[cat] = { done: 0, total: 0 }
    catMap[cat].total++
    if (h.doneToday) catMap[cat].done++
  }
  const categories = Object.entries(catMap)

  const heatmapData = buildHeatmapData(allDerivedHabits.flatMap((h) => h.history || []))

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s) => (
          <StreakCard key={s.label} {...s} />
        ))}
      </div>

      <QuoteBlock />

      <div>
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] overflow-hidden">
          {allDerivedHabits.length === 0 ? (
            <EmptyState onAdd={onAdd} />
          ) : filteredHabits.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--tx2)]">
              No habits match your search or filter.
            </div>
          ) : (
            <>
              <WeekHeader />
              <div className="divide-y divide-[var(--dv)]">
                {filteredHabits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    onToggleToday={() => onToggleToday(habit.id)}
                    onEdit={(newName) => onEdit(habit.id, newName)}
                    onDelete={() => onDelete(habit)}
                    isNew={habit.id === newHabitId}
                    isDeleting={habit.id === deletingId}
                  />
                ))}
              </div>
            </>
          )}
          <button
            onClick={onAdd}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--bg2)] transition-colors border-t border-[var(--dv)]"
          >
            <Plus className="w-4 h-4" />
            Add a habit...
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[var(--tx)] mb-3">Category Progress</h2>
          <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] divide-y divide-[var(--dv)]">
            {categories.map(([name, { done, total }], i) => (
              <div key={name} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--tx)]">{name}</span>
                  <span className="text-xs text-[var(--tx2)] tabular-nums">{done}/{total}</span>
                </div>
                <ProgressBar value={done} max={total} color={CAT_COLORS[i % CAT_COLORS.length]} />
              </div>
            ))}
          </div>
        </div>
      )}

      <HeatmapBlock data={heatmapData} />
    </div>
  )
}
