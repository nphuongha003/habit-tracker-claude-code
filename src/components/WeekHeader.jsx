function getCurrentWeek() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay() // 0=Sun
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return dayLabels.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { label, date: d.getDate(), isToday: d.toDateString() === today.toDateString() }
  })
}

const days = getCurrentWeek()

export default function WeekHeader() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--dv)]">
      <div className="flex-1" />
      <div className="hidden sm:flex items-center gap-1">
        {days.map(({ label, date, isToday }) => (
          <div key={date} className="w-6 text-center">
            <p className="text-[10px] text-[var(--tx2)] mb-1">{label}</p>
            <div
              className={
                isToday
                  ? 'w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center mx-auto'
                  : ''
              }
            >
              <p className={isToday ? 'text-[10px] font-semibold text-white' : 'text-[10px] text-[var(--tx2)]'}>
                {date}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-5 text-center">
        <p className="text-[10px] text-[var(--tx2)]">Today</p>
      </div>
      <div className="hidden md:flex items-center gap-3 w-[108px] justify-end pr-1">
        <p className="text-[10px] text-[var(--tx2)]">Streak</p>
        <p className="text-[10px] text-[var(--tx2)]">Best</p>
        <p className="text-[10px] text-[var(--tx2)]">#</p>
      </div>
      <div className="w-[52px]" />
    </div>
  )
}
