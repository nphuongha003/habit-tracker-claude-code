export function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function buildHeatmapData(allDates) {
  const counts = {}
  for (const d of allDates) counts[d] = (counts[d] || 0) + 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 26 * 7 + 1)
  const dow = startDate.getDay()
  startDate.setDate(startDate.getDate() - (dow === 0 ? 6 : dow - 1))
  const values = Object.values(counts).filter((v) => v > 0)
  const maxCount = values.length ? Math.max(...values) : 1
  const weeks = []
  const cur = new Date(startDate)
  for (let w = 0; w < 26; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const ds = toDateStr(cur)
      const count = counts[ds] || 0
      week.push(count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4)))
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}
