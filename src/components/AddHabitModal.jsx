import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLOR_OPTIONS = [
  { color: 'bg-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-500' },
  { color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-500' },
  { color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
  { color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
  { color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-500' },
  { color: 'bg-cyan-500', bgColor: 'bg-cyan-50', textColor: 'text-cyan-500' },
  { color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
  { color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-500' },
]

export default function AddHabitModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd({ name: trimmed, ...COLOR_OPTIONS[selectedColor] })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-overlay-in">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" onClick={onClose} />

      <div className="relative bg-[var(--bg)] rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-modal-in border border-[var(--bd)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--tx)]">New Habit</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[var(--bgh)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--tx2)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-xs font-medium text-[var(--tx2)] block mb-1.5">
              Habit name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run"
              className="w-full text-sm text-[var(--tx)] border border-[var(--bd)] rounded-lg px-3 py-2 outline-none focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 transition-all bg-[var(--bg)] placeholder:text-[var(--txm)]"
            />
          </div>

          <div className="mb-5">
            <label className="text-xs font-medium text-[var(--tx2)] block mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColor(i)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-all duration-150',
                    opt.color,
                    selectedColor === i
                      ? 'scale-125 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[var(--bg)]'
                      : 'hover:scale-110'
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 text-sm text-[var(--tx)] border border-[var(--bd)] rounded-xl hover:bg-[var(--bgh)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-3 py-2.5 text-sm bg-[var(--tx)] text-[var(--bg)] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
