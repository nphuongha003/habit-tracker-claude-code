import { Flame, Target, Calendar, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

function StatBlock({ icon: Icon, iconColor, label, value, subtext, gradient }) {
  return (
    <div className={cn('rounded-xl p-5 border', gradient)}>
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconColor)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--tx2)] uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-[var(--tx)] mt-1 tabular-nums leading-tight">{value}</p>
          <p className="text-xs text-[var(--tx2)] mt-0.5">{subtext}</p>
        </div>
      </div>
    </div>
  )
}

export default function GoalsView({ derivedHabits }) {
  const totalHabits = derivedHabits.length
  const doneToday = derivedHabits.filter((h) => h.doneToday).length
  const donePct = totalHabits === 0 ? 0 : Math.round((doneToday / totalHabits) * 100)

  const weekDone = derivedHabits.reduce((s, h) => s + (h.completedDays?.length || 0), 0)
  const weekTotal = totalHabits * 7
  const weekPct = weekTotal === 0 ? 0 : Math.round((weekDone / weekTotal) * 100)

  const bestCurrentStreak = Math.max(0, ...derivedHabits.map((h) => h.currentStreak))
  const bestAllTime = Math.max(0, ...derivedHabits.map((h) => h.longestStreak))
  const topStreakHabit = derivedHabits.reduce(
    (best, h) => (h.currentStreak > (best?.currentStreak ?? 0) ? h : best),
    null
  )

  if (totalHabits === 0) {
    return (
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] p-10 text-center">
        <p className="text-sm text-[var(--tx2)]">Add some habits to track your goals.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatBlock
          icon={Target}
          iconColor="bg-green-500"
          label="Daily Goal"
          value={`${doneToday} / ${totalHabits}`}
          subtext={`${donePct}% of today's habits done`}
          gradient="from-green-50 to-emerald-50 dark:from-green-950/25 dark:to-emerald-950/25 border-green-100 dark:border-green-900/30 bg-gradient-to-br"
        />
        <StatBlock
          icon={Calendar}
          iconColor="bg-blue-500"
          label="Weekly Completion"
          value={`${weekDone} / ${weekTotal}`}
          subtext={`${weekPct}% of all habit-days this week`}
          gradient="from-blue-50 to-indigo-50 dark:from-blue-950/25 dark:to-indigo-950/25 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br"
        />
        <StatBlock
          icon={Flame}
          iconColor="bg-orange-500"
          label="Current Best Streak"
          value={`${bestCurrentStreak}d`}
          subtext={topStreakHabit ? topStreakHabit.name : 'No active streak'}
          gradient="from-orange-50 to-amber-50 dark:from-orange-950/25 dark:to-amber-950/25 border-orange-100 dark:border-orange-900/30 bg-gradient-to-br"
        />
        <StatBlock
          icon={Trophy}
          iconColor="bg-amber-500"
          label="Best Streak Ever"
          value={`${bestAllTime}d`}
          subtext="All-time record across all habits"
          gradient="from-yellow-50 to-amber-50 dark:from-yellow-950/25 dark:to-amber-950/25 border-yellow-100 dark:border-yellow-900/30 bg-gradient-to-br"
        />
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--tx)] mb-3">Habit Streaks</h3>
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] divide-y divide-[var(--dv)]">
          {[...derivedHabits]
            .sort((a, b) => b.currentStreak - a.currentStreak)
            .map((h) => {
              const Icon = h.icon
              return (
                <div key={h.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', h.bgColor)}>
                    <Icon className={cn('w-4 h-4', h.textColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--tx)] truncate">{h.name}</p>
                    <p className="text-xs text-[var(--tx2)]">{h.category}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <p className="text-[10px] text-[var(--tx2)] mb-0.5">Current</p>
                      <p className="text-sm font-bold text-[var(--tx)] tabular-nums">{h.currentStreak}d</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--tx2)] mb-0.5">Best</p>
                      <p className="text-sm font-semibold text-amber-500 tabular-nums">{h.longestStreak}d</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--tx2)] mb-0.5">Total</p>
                      <p className="text-sm text-[var(--tx2)] tabular-nums">{h.totalCompleted}</p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
