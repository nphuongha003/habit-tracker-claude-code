import { useState } from 'react'
import { Flame, Pencil, Trash2, Check, X, Trophy, Hash } from 'lucide-react'
import HabitCheckbox from './HabitCheckbox'
import { cn } from '@/lib/utils'

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function HabitRow({ habit, onToggleToday, onEdit, onDelete, isNew, isDeleting }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(habit.name)

  const {
    icon: Icon, name, color, bgColor, textColor,
    completedDays, category, doneToday,
    currentStreak, longestStreak, totalCompleted,
  } = habit

  const submitEdit = () => {
    const trimmed = editValue.trim()
    if (trimmed) onEdit(trimmed)
    setEditing(false)
  }

  const cancelEdit = () => {
    setEditValue(name)
    setEditing(false)
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-3 transition-colors border border-transparent',
        'hover:bg-[var(--bg2)] hover:border-[var(--bd)]',
        isNew && 'animate-habit-enter',
        isDeleting && 'animate-habit-exit'
      )}
    >
      {/* Icon */}
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', bgColor)}>
        <Icon className={cn('w-4 h-4', textColor)} />
      </div>

      {/* Name & category */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              className="flex-1 text-sm font-medium border border-[#2383e2] rounded px-2 py-0.5 outline-none min-w-0 bg-[var(--bg)] text-[var(--tx)]"
            />
            <button onClick={submitEdit} className="p-0.5 rounded hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors shrink-0">
              <Check className="w-3.5 h-3.5 text-green-500" />
            </button>
            <button onClick={cancelEdit} className="p-0.5 rounded hover:bg-[var(--bgh)] transition-colors shrink-0">
              <X className="w-3.5 h-3.5 text-[var(--tx2)]" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-[var(--tx)] truncate">{name}</p>
            <p className="text-xs text-[var(--tx2)]">{category}</p>
          </>
        )}
      </div>

      {/* Week grid */}
      <div className="hidden sm:flex items-center gap-1">
        {weekDays.map((_, i) => {
          const done = completedDays.includes(i)
          return (
            <div
              key={i}
              className={cn(
                'w-6 h-6 rounded flex items-center justify-center text-[10px] font-medium transition-colors',
                done ? `${color} text-white` : 'bg-[var(--dv)] text-[var(--txm)]'
              )}
            >
              {done ? '✓' : ''}
            </div>
          )
        })}
      </div>

      {/* Today's checkbox */}
      <HabitCheckbox checked={doneToday} color={color} onClick={onToggleToday} />

      {/* Per-habit stats */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-0.5" title="Current streak">
          <Flame
            className={cn(
              'w-3.5 h-3.5',
              currentStreak > 10 ? 'text-orange-500' : currentStreak > 5 ? 'text-yellow-500' : 'text-[var(--txm)]'
            )}
          />
          <span className="text-xs font-medium text-[var(--tx)] w-5 tabular-nums">{currentStreak}</span>
        </div>
        <div className="flex items-center gap-0.5" title="Longest streak">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-[var(--tx2)] w-5 tabular-nums">{longestStreak}</span>
        </div>
        <div className="flex items-center gap-0.5" title="Total completed">
          <Hash className="w-3 h-3 text-[var(--txm)]" />
          <span className="text-xs text-[var(--tx2)] w-6 tabular-nums">{totalCompleted}</span>
        </div>
      </div>

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditValue(name); setEditing(true) }}
            className="p-1 rounded hover:bg-[var(--bgh)] transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5 text-[var(--tx2)]" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-[var(--tx2)] hover:text-red-400" />
          </button>
        </div>
      )}
    </div>
  )
}
