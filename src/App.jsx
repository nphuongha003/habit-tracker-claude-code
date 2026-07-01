import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Flame, Plus, Search, CheckCircle2, Target, TrendingUp,
  Dumbbell, BookOpen, Droplets, Moon, Star, Zap,
  Filter, Menu, X, ChevronDown,
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import AddHabitModal from './components/AddHabitModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import ToastContainer from './components/Toast'
import TodayView from './views/TodayView'
import WeeklyView from './views/WeeklyView'
import AnalyticsView from './views/AnalyticsView'
import GoalsView from './views/GoalsView'
import { useTheme } from './hooks/useTheme'

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
function todayStr() { return toDateStr(new Date()) }
function daysAgoStr(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return toDateStr(d)
}

function calcCurrentStreak(history) {
  if (!history.length) return 0
  const set = new Set(history)
  const d = new Date()
  if (!set.has(toDateStr(d))) d.setDate(d.getDate() - 1)
  let streak = 0
  while (set.has(toDateStr(d))) { streak++; d.setDate(d.getDate() - 1) }
  return streak
}
function calcLongestStreak(history) {
  if (!history.length) return 0
  const sorted = [...new Set(history)].sort()
  let longest = 1, cur = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000
    if (diff === 1) { cur++; longest = Math.max(longest, cur) } else cur = 1
  }
  return longest
}
function getWeekCompletedDays(history) {
  const set = new Set(history)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    return set.has(toDateStr(d)) ? i : null
  }).filter((d) => d !== null)
}
function deriveHabit(habit) {
  const history = habit.history ?? []
  return {
    ...habit,
    doneToday: history.includes(todayStr()),
    completedDays: getWeekCompletedDays(history),
    currentStreak: calcCurrentStreak(history),
    longestStreak: calcLongestStreak(history),
    totalCompleted: history.length,
  }
}
function makeHistory(streak, doneToday) {
  const start = doneToday ? 0 : 1
  return Array.from({ length: streak }, (_, i) => daysAgoStr(start + i))
}

const ICON_MAP = { Dumbbell, BookOpen, Droplets, Moon, Star, Zap }
const STORAGE_KEY = 'habit-tracker-habits'

function serializeHabits(habits) {
  return habits.map(({ icon, ...rest }) => ({
    ...rest,
    iconName: Object.keys(ICON_MAP).find((k) => ICON_MAP[k] === icon) ?? 'Zap',
  }))
}
function deserializeHabits(data) {
  return data.map(({ iconName, ...rest }) => {
    const icon = ICON_MAP[iconName] ?? Zap
    if (!rest.history) {
      const { streak = 0, doneToday = false, completedDays, ...clean } = rest
      return { ...clean, icon, history: makeHistory(streak, doneToday) }
    }
    return { ...rest, icon }
  })
}
function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return deserializeHabits(parsed)
  } catch { return null }
}

let nextId = 6
const initialHabits = [
  { id: 1, icon: Dumbbell, name: 'Morning Workout', category: 'Health & Fitness', color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-500', history: makeHistory(12, true) },
  { id: 2, icon: BookOpen, name: 'Read 30 minutes', category: 'Learning', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-500', history: makeHistory(7, true) },
  { id: 3, icon: Droplets, name: 'Drink 8 glasses of water', category: 'Health & Fitness', color: 'bg-cyan-500', bgColor: 'bg-cyan-50', textColor: 'text-cyan-500', history: makeHistory(5, true) },
  { id: 4, icon: Moon, name: 'Sleep by 11 PM', category: 'Sleep', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-500', history: makeHistory(3, false) },
  { id: 5, icon: Star, name: 'Meditate 10 minutes', category: 'Mindfulness', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', history: makeHistory(21, false) },
]

const VIEW_CONFIG = {
  today:     { emoji: '🎯', title: 'Today' },
  weekly:    { emoji: '📅', title: 'Weekly View' },
  analytics: { emoji: '📊', title: 'Analytics' },
  goals:     { emoji: '🏆', title: 'Goals' },
}

export default function App() {
  const { theme, toggleTheme } = useTheme()

  const [habits, setHabits] = useState(() => {
    const saved = loadHabits()
    if (saved && saved.length > 0) nextId = Math.max(...saved.map((h) => h.id), nextId)
    return saved ?? initialHabits
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [newHabitId, setNewHabitId] = useState(null)
  const [toasts, setToasts] = useState([])

  const [activeView, setActiveView] = useState('today')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    if (!showFilter) return
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showFilter])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeHabits(habits)))
    } catch {}
  }, [habits])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const derivedHabits = habits.map(deriveHabit)
  const doneCount = derivedHabits.filter((h) => h.doneToday).length
  const totalCount = derivedHabits.length
  const donePct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)
  const remaining = totalCount - doneCount
  const overallBestStreak = Math.max(0, ...derivedHabits.map((h) => h.longestStreak))
  const totalAllCompletions = derivedHabits.reduce((s, h) => s + h.totalCompleted, 0)
  const doneThisWeek = derivedHabits.filter((h) => h.completedDays.length > 0).length

  const stats = [
    { label: 'Best Streak', value: `${overallBestStreak}d`, subtext: 'Across all habits', icon: Flame, gradient: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/25 dark:to-amber-950/25 border border-orange-100 dark:border-orange-900/30', iconColor: 'bg-orange-400' },
    { label: "Today's Progress", value: `${doneCount} / ${totalCount}`, subtext: `${donePct}% completed`, icon: CheckCircle2, gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/25 dark:to-emerald-950/25 border border-green-100 dark:border-green-900/30', iconColor: 'bg-green-500' },
    { label: 'This Week', value: `${doneThisWeek} / ${totalCount}`, subtext: 'Habits active this week', icon: Target, gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/25 dark:to-indigo-950/25 border border-blue-100 dark:border-blue-900/30', iconColor: 'bg-blue-500' },
    { label: 'Total Completions', value: String(totalAllCompletions), subtext: 'All time', icon: TrendingUp, gradient: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/25 dark:to-purple-950/25 border border-violet-100 dark:border-violet-900/30', iconColor: 'bg-violet-500' },
  ]

  const categories = [...new Set(derivedHabits.map((h) => h.category).filter(Boolean))]
  const filteredHabits = derivedHabits.filter((h) => {
    const matchSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = !filterCategory || h.category === filterCategory
    return matchSearch && matchCat
  })

  const handleViewChange = (view) => {
    setActiveView(view)
    setSearchQuery('')
    setFilterCategory(null)
    setShowSearch(false)
    setShowFilter(false)
    setSidebarOpen(false)
  }

  const toggleToday = (id) => {
    const today = todayStr()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = h.history.includes(today)
        return { ...h, history: done ? h.history.filter((d) => d !== today) : [...h.history, today] }
      })
    )
  }

  const toggleDay = (id, dateStr) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = h.history.includes(dateStr)
        return { ...h, history: done ? h.history.filter((d) => d !== dateStr) : [...h.history, dateStr] }
      })
    )
  }

  const editHabit = (id, newName) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name: newName } : h)))
    addToast('Habit updated', 'info')
  }

  const deleteHabit = () => {
    const id = deleteTarget.id
    setDeleteTarget(null)
    setDeletingId(id)
    setTimeout(() => {
      setHabits((prev) => prev.filter((h) => h.id !== id))
      setDeletingId(null)
      addToast('Habit deleted', 'error')
    }, 240)
  }

  const addHabit = ({ name, category, color, bgColor, textColor }) => {
    const id = ++nextId
    setHabits((prev) => [
      ...prev,
      { id, icon: Zap, name, category: category || 'General', color, bgColor, textColor, history: [] },
    ])
    setNewHabitId(id)
    setTimeout(() => setNewHabitId(null), 500)
    addToast('Habit added', 'success')
  }

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
  const { emoji, title } = VIEW_CONFIG[activeView]

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showAddModal && (
        <AddHabitModal onAdd={addHabit} onClose={() => setShowAddModal(false)} existingCategories={categories} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          habitName={deleteTarget.name}
          onConfirm={deleteHabit}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Sidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={handleViewChange}
        habits={derivedHabits}
        onAdd={() => setShowAddModal(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-[var(--bgh)] transition-colors shrink-0"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5 text-[var(--tx2)]" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xl sm:text-2xl">{emoji}</span>
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--tx)] truncate">{title}</h1>
                  </div>
                  {activeView === 'today' && (
                    <p className="text-sm text-[var(--tx2)]">{todayLabel}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeView === 'today' && (
                  <>
                    <div className="relative" ref={filterRef}>
                      <button
                        onClick={() => { setShowFilter((f) => !f); setShowSearch(false) }}
                        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filterCategory
                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                            : 'text-[var(--tx2)] hover:bg-[var(--bgh)] hover:text-[var(--tx)]'
                        }`}
                      >
                        <Filter className="w-3.5 h-3.5" />
                        {filterCategory ? filterCategory : 'Filter'}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showFilter && (
                        <div className="absolute right-0 top-full mt-1.5 bg-[var(--bg)] border border-[var(--bd)] rounded-xl shadow-xl z-20 py-1 min-w-[180px] animate-modal-in">
                          <button
                            onClick={() => { setFilterCategory(null); setShowFilter(false) }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--bgh)] ${!filterCategory ? 'font-medium text-violet-500' : 'text-[var(--tx)]'}`}
                          >
                            All categories
                          </button>
                          <div className="border-t border-[var(--dv)] my-1" />
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => { setFilterCategory(cat); setShowFilter(false) }}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--bgh)] ${filterCategory === cat ? 'font-medium text-violet-500' : 'text-[var(--tx)]'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => { setShowSearch((s) => !s); setShowFilter(false) }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        showSearch
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-500'
                          : 'hover:bg-[var(--bgh)] text-[var(--tx2)]'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[var(--tx)] text-[var(--bg)] hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Habit</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            {activeView === 'today' && showSearch && (
              <div className="mt-3 flex items-center gap-2 bg-[var(--bg2)] rounded-xl px-3 py-2 border border-[var(--bd)] focus-within:border-[#2383e2] transition-colors">
                <Search className="w-4 h-4 text-[var(--tx2)] shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search habits…"
                  className="flex-1 text-sm bg-transparent text-[var(--tx)] placeholder:text-[var(--txm)] outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-4 h-4 text-[var(--tx2)] hover:text-[var(--tx)] transition-colors" />
                  </button>
                )}
              </div>
            )}

            {activeView === 'today' && filterCategory && (
              <div className="mt-2 flex sm:hidden items-center gap-2">
                <span className="text-xs text-[var(--tx2)]">Filtered by:</span>
                <span className="flex items-center gap-1 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">
                  {filterCategory}
                  <button onClick={() => setFilterCategory(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}

            {activeView === 'today' && (
              <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
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
                  {remaining === 0
                    ? 'All done for today! 🎉'
                    : `${remaining} more to hit your daily goal 💪`}
                </p>
              </div>
            )}
          </div>

          {activeView === 'today' && (
            <TodayView
              filteredHabits={filteredHabits}
              allDerivedHabits={derivedHabits}
              newHabitId={newHabitId}
              deletingId={deletingId}
              onToggleToday={toggleToday}
              onEdit={editHabit}
              onDelete={(habit) => setDeleteTarget(habit)}
              onAdd={() => setShowAddModal(true)}
              stats={stats}
            />
          )}
          {activeView === 'weekly' && (
            <WeeklyView habits={derivedHabits} toggleDay={toggleDay} />
          )}
          {activeView === 'analytics' && (
            <AnalyticsView derivedHabits={derivedHabits} stats={stats} />
          )}
          {activeView === 'goals' && (
            <GoalsView derivedHabits={derivedHabits} />
          )}

        </div>
      </main>
    </div>
  )
}
