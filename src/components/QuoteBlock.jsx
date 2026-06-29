export default function QuoteBlock() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-100 dark:border-violet-900/40 p-4 flex gap-3">
      <div className="w-1 rounded-full bg-violet-400 shrink-0" />
      <div>
        <p className="text-sm text-[var(--tx)] italic leading-relaxed">
          "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
        </p>
        <p className="text-xs text-[var(--tx2)] mt-1.5">— Aristotle</p>
      </div>
    </div>
  )
}
