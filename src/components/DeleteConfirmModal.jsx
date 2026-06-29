import { X, Trash2 } from 'lucide-react'

export default function DeleteConfirmModal({ habitName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-overlay-in">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" onClick={onCancel} />

      <div className="relative bg-[var(--bg)] rounded-2xl shadow-2xl w-full max-w-xs p-5 animate-modal-in border border-[var(--bd)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-[var(--tx)]">Delete habit?</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-md hover:bg-[var(--bgh)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--tx2)]" />
          </button>
        </div>

        <p className="text-sm text-[var(--tx2)] mb-5 leading-relaxed">
          "<span className="text-[var(--tx)] font-medium">{habitName}</span>" will be permanently
          deleted. This cannot be undone.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2.5 text-sm text-[var(--tx)] border border-[var(--bd)] rounded-xl hover:bg-[var(--bgh)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
