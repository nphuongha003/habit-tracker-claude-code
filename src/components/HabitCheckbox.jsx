import { useState, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HabitCheckbox({ checked = false, color = 'bg-violet-500', onClick }) {
  const [popping, setPopping] = useState(false)
  const prevRef = useRef(checked)

  useEffect(() => {
    if (checked && !prevRef.current) {
      setPopping(true)
      const t = setTimeout(() => setPopping(false), 200)
      return () => clearTimeout(t)
    }
    prevRef.current = checked
  }, [checked])

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      className={cn(
        'w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-150 shrink-0',
        checked
          ? `${color} border-transparent`
          : 'border-[var(--txm)] bg-[var(--bg)] hover:border-[var(--tx2)]',
        popping && 'animate-checkbox-pop'
      )}
    >
      {checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
    </button>
  )
}
