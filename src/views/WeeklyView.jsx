import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekDates() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      label,
      date: d.getDate(),
      dateStr: toDateStr(d),
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

export default function WeeklyView({ habits, toggleDay }) {
  const weekDates = getWeekDates()

  return (
    <div>
      {habits.length === 0 ? (
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] p-10 text-center">
          <p className="text-sm text-[var(--tx2)]">No habits yet. Add some habits first.</p>
        </div>
      ) : (
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] overflow-hidden">
          <div className="flex items-center border-b border-[var(--bd)] bg-[var(--bg2)]">
            <div className="w-40 sm:w-52 shrink-0 px-4 py-2.5">
              <span className="text-[10px] font-medium text-[var(--tx2)] uppercase tracking-wider">Habit</span>
            </div>
            <div className="flex flex-1 overflow-x-auto">
              {weekDates.map(({ label, date, isToday }) => (
                <div key={label + date} className="flex-1 min-w-[48px] text-center py-2">
                  <p className="text-[10px] text-[var(--tx2)]">{label}</p>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full mx-auto mt-0.5 flex items-center justify-center',
                      isToday ? 'bg-violet-500' : ''
                    )}
                  >
                    <p className={cn('text-[10px]', isToday ? 'font-bold text-white' : 'text-[var(--tx2)]')}>
                      {date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-14 sm:w-16 shrink-0 text-center py-2.5 pr-3">
              <span className="text-[10px] font-medium text-[var(--tx2)] uppercase tracking-wider">Done</span>
            </div>
          </div>

          <div className="divide-y divide-[var(--dv)]">
            {habits.map((habit) => {
              const Icon = habit.icon
              const history = habit.history || []
              const weekDone = weekDates.filter(({ dateStr }) => history.includes(dateStr)).length

              return (
                <div key={habit.id} className="flex items-center hover:bg-[var(--bg2)] transition-colors">
                  <div className="w-40 sm:w-52 shrink-0 flex items-center gap-2 px-4 py-3">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', habit.bgColor)}>
                      <Icon className={cn('w-3.5 h-3.5', habit.textColor)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--tx)] truncate leading-tight">{habit.name}</p>
                      <p className="text-[10px] text-[var(--tx2)] truncate">{habit.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 overflow-x-auto">
                    {weekDates.map(({ dateStr, isToday }) => {
                      const done = history.includes(dateStr)
                      return (
                        <div key={dateStr} className="flex-1 min-w-[48px] flex justify-center items-center py-3">
                          <button
                            onClick={() => toggleDay(habit.id, dateStr)}
                            className={cn(
                              'w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-150 hover:scale-110',
                              done
                                ? `${habit.color} border-transparent`
                                : isToday
                                ? 'border-[var(--tx2)] bg-[var(--bg)] hover:border-[var(--tx)]'
                                : 'border-[var(--txm)] bg-[var(--bg)] hover:border-[var(--tx2)]'
                            )}
                          >
                            {done && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="w-14 sm:w-16 shrink-0 text-center py-3 pr-3">
                    <span
                      className={cn(
                        'text-sm font-bold tabular-nums',
                        weekDone === 7
                          ? 'text-green-500'
                          : weekDone >= 5
                          ? 'text-violet-500'
                          : 'text-[var(--tx)]'
                      )}
                    >
                      {weekDone}
                    </span>
                    <span className="text-[10px] text-[var(--tx2)]">/7</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-[var(--bd)] bg-[var(--bg2)] flex items-center">
            <div className="w-40 sm:w-52 shrink-0 px-4 py-2">
              <span className="text-xs font-medium text-[var(--tx2)]">Totals</span>
            </div>
            <div className="flex flex-1 overflow-x-auto">
              {weekDates.map(({ dateStr }) => {
                const count = habits.filter((h) => (h.history || []).includes(dateStr)).length
                return (
                  <div key={dateStr} className="flex-1 min-w-[48px] flex justify-center items-center py-2">
                    <span
                      className={cn(
                        'text-xs font-medium tabular-nums',
                        count === habits.length
                          ? 'text-green-500'
                          : count > 0
                          ? 'text-[var(--tx)]'
                          : 'text-[var(--txm)]'
                      )}
                    >
                      {count}/{habits.length}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="w-14 sm:w-16 shrink-0" />
          </div>
        </div>
      )}
    </div>
  )
}
