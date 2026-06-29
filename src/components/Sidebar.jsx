import {
  BarChart2,
  Calendar,
  Settings,
  Plus,
  ChevronDown,
  Flame,
  Star,
  Target,
  Sun,
  Moon,
  Dumbbell,
  BookOpen,
  Droplets,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Sun, label: 'Today', active: true },
  { icon: Calendar, label: 'Weekly View' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Target, label: 'Goals' },
]

const sidebarHabits = [
  { icon: Dumbbell, label: 'Morning Workout', color: 'text-orange-500', streak: 12 },
  { icon: BookOpen, label: 'Read 30 mins', color: 'text-blue-500', streak: 7 },
  { icon: Droplets, label: 'Drink 8 glasses', color: 'text-cyan-500', streak: 5 },
  { icon: Moon, label: 'Sleep by 11 PM', color: 'text-purple-500', streak: 3 },
  { icon: Star, label: 'Meditate', color: 'text-yellow-500', streak: 21 },
]

export default function Sidebar({ theme, onToggleTheme, isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden animate-overlay-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed md:sticky top-0 z-40 md:z-auto h-screen flex flex-col overflow-y-auto',
          'w-60 shrink-0 border-r border-[var(--bd)] bg-[var(--bg2)]',
          'transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Workspace header */}
        <div className="flex items-center gap-2 px-3 py-3.5 hover:bg-[var(--bgh)] cursor-pointer transition-colors mx-2 mt-1 rounded-md">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
            <Flame className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--tx)] flex-1 truncate">My Habits</span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--tx2)]" />
          {/* Mobile close button */}
          <button
            className="md:hidden p-0.5 rounded hover:bg-[var(--bgh)] transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-[var(--tx2)]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-1 px-2 space-y-0.5">
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left',
                active
                  ? 'bg-[var(--bg)] text-[var(--tx)] shadow-sm font-medium'
                  : 'text-[var(--tx)] hover:bg-[var(--bgh)]'
              )}
            >
              <Icon className={cn('w-4 h-4', active ? 'text-[var(--tx)]' : 'text-[var(--tx2)]')} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mx-3 my-3 border-t border-[var(--bd)]" />

        {/* Habits list */}
        <div className="px-2 flex-1">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-medium text-[var(--tx2)] uppercase tracking-wide">Habits</span>
            <button className="p-0.5 rounded hover:bg-[var(--bgh)] transition-colors">
              <Plus className="w-3.5 h-3.5 text-[var(--tx2)]" />
            </button>
          </div>

          <div className="space-y-0.5">
            {sidebarHabits.map(({ icon: Icon, label, color, streak }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[var(--tx)] hover:bg-[var(--bgh)] transition-colors text-left group"
              >
                <Icon className={cn('w-4 h-4 shrink-0', color)} />
                <span className="flex-1 truncate">{label}</span>
                <span className="text-xs text-[var(--tx2)] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Flame className="w-3 h-3 text-orange-400" />
                  {streak}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="px-2 pb-3 pt-2 border-t border-[var(--bd)] mt-2 space-y-0.5">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[var(--tx)] hover:bg-[var(--bgh)] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--tx2)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--tx2)]" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[var(--tx)] hover:bg-[var(--bgh)] transition-colors">
            <Settings className="w-4 h-4 text-[var(--tx2)]" />
            Settings
          </button>
        </div>
      </aside>
    </>
  )
}
