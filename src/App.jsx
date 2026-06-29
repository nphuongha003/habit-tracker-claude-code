import { useState, useEffect, useCallback } from 'react'
import {
  Flame, Plus, Search, CheckCircle2, Target, TrendingUp,
  Dumbbell, BookOpen, Droplets, Moon, Star, Zap,
  Filter, ChevronRight, Menu, Sparkles,
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import HabitRow from './components/HabitRow'
import WeekHeader from './components/WeekHeader'
import StreakCard from './components/StreakCard'
import HeatmapBlock from './components/HeatmapBlock'
import QuoteBlock from './components/QuoteBlock'
import AddHabitModal from './components/AddHabitModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import ToastContainer from './components/Toast'
import { useTheme } from './hooks/useTheme'

// ─── Date helpers ────────────────────────────────────────────────────────────

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

// ─── Streak calculations ─────────────────────────────────────────────────────

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

// ─── localStorage ─────────────────────────────────────────────────────────────

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
    if (!Array.isArray(parsed) || !parsed.length) return null
    return deserializeHabits(parsed)
  } catch { return null }
}

// ─── Initial data ─────────────────────────────────────────────────────────────

let nextId = 6
const initialHabits = [
  { id: 1, icon: Dumbbell, name: 'Morning Workout', category: 'Health & Fitness', color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-500', history: makeHistory(12, true) },
  { id: 2, icon: BookOpen, name: 'Read 30 minutes', category: 'Learning', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-500', history: makeHistory(7, true) },
  { id: 3, icon: Droplets, name: 'Drink 8 glasses of water', category: 'Health', color: 'bg-cyan-500', bgColor: 'bg-cyan-50', textColor: 'text-cyan-500', history: makeHistory(5, true) },
  { id: 4, icon: Moon, name: 'Sleep by 11 PM', category: 'Sleep', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-500', history: makeHistory(3, false) },
  { id: 5, icon: Star, name: 'Meditate 10 minutes', category: 'Mindfulness', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', history: makeHistory(21, false) },
]

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = 'bg-violet-500' }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[var(--dv)] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-[var(--tx2)] w-8 text-right tabular-nums">{pct}%</span>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { theme, toggleTheme } = useTheme()

  const [habits, setHabits] = useState(() => {
    const saved = loadHabits()
    if (saved) nextId = Math.max(...saved.map((h) => h.id), nextId)
    return saved ?? initialHabits
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [newHabitId, setNewHabitId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeHabits(habits)))
    } catch {}
  }, [habits])

  // ── Toast helper ────────────────────────────────────────────────────────────

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ── Derived data ────────────────────────────────────────────────────────────

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
    { label: 'This Week', value: `${doneThisWeek} / ${totalCount}`, subtext: 'Habits done this week', icon: Target, gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/25 dark:to-indigo-950/25 border border-blue-100 dark:border-blue-900/30', iconColor: 'bg-blue-500' },
    { label: 'Total Completions', value: String(totalAllCompletions), subtext: 'All time', icon: TrendingUp, gradient: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/25 dark:to-purple-950/25 border border-violet-100 dark:border-violet-900/30', iconColor: 'bg-violet-500' },
  ]

  // ── Handlers ────────────────────────────────────────────────────────────────

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

  const addHabit = ({ name, color, bgColor, textColor }) => {
    const id = ++nextId
    setHabits((prev) => [...prev, { id, icon: Zap, name, category: 'General', color, bgColor, textColor, history: [] }])
    setNewHabitId(id)
    setTimeout(() => setNewHabitId(null), 500)
    addToast('Habit added', 'success')
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showAddModal && (
        <AddHabitModal onAdd={addHabit} onClose={() => setShowAddModal(false)} />
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
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Page header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-[var(--bgh)] transition-colors shrink-0"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5 text-[var(--tx2)]" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xl sm:text-2xl">🎯</span>
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--tx)]">Today</h1>
                  </div>
                  <p className="text-sm text-[var(--tx2)]">{today}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--tx2)] hover:bg-[var(--bgh)] hover:text-[var(--tx)] transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </button>
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

            {/* Daily progress banner */}
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
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {stats.map((s) => (
              <StreakCard key={s.label} {...s} />
            ))}
          </div>

          {/* Quote */}
          <div className="mb-6 sm:mb-8">
            <QuoteBlock />
          </div>

          {/* Habits section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[var(--tx)]">Habits</h2>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[var(--bgh)] transition-colors">
                  <Search className="w-4 h-4 text-[var(--tx2)]" />
                </button>
                <button className="hidden sm:flex items-center gap-1 text-xs text-[var(--tx2)] hover:text-[var(--tx)] px-2 py-1.5 rounded-lg hover:bg-[var(--bgh)] transition-colors">
                  All categories
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] overflow-hidden">
              {derivedHabits.length === 0 ? (
                <EmptyState onAdd={() => setShowAddModal(true)} />
              ) : (
                <>
                  <WeekHeader />
                  <div className="divide-y divide-[var(--dv)]">
                    {derivedHabits.map((habit) => (
                      <HabitRow
                        key={habit.id}
                        habit={habit}
                        onToggleToday={() => toggleToday(habit.id)}
                        onEdit={(newName) => editHabit(habit.id, newName)}
                        onDelete={() => setDeleteTarget(habit)}
                        isNew={habit.id === newHabitId}
                        isDeleting={habit.id === deletingId}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--bg2)] transition-colors border-t border-[var(--dv)]"
              >
                <Plus className="w-4 h-4" />
                Add a habit...
              </button>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base font-semibold text-[var(--tx)] mb-3">Category Progress</h2>
            <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bd)] divide-y divide-[var(--dv)]">
              {[
                { name: 'Health & Fitness', value: 4, max: 5, color: 'bg-orange-400' },
                { name: 'Learning', value: 3, max: 5, color: 'bg-blue-400' },
                { name: 'Mindfulness', value: 5, max: 5, color: 'bg-yellow-400' },
                { name: 'Sleep', value: 2, max: 5, color: 'bg-purple-400' },
              ].map(({ name, value, max, color }) => (
                <div key={name} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--tx)]">{name}</span>
                    <span className="text-xs text-[var(--tx2)] tabular-nums">{value}/{max}</span>
                  </div>
                  <ProgressBar value={value} max={max} color={color} />
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="mb-6 sm:mb-8">
            <HeatmapBlock />
          </div>

        </div>
      </main>
    </div>
  )
}
