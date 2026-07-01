# Habit Tracker

A Notion-style habit tracking app built with React. Track daily habits, view weekly progress, analyze streaks, and monitor goals — all stored locally in the browser with no backend required.

## Features

- **Today view** — check off habits for the day with animated checkboxes and a daily progress banner
- **Weekly view** — full Mon–Sun grid to tick habits on any day of the week
- **Analytics** — stats cards, category progress bars, and a 6-month activity heatmap built from real history data
- **Goals** — daily goal, weekly completion rate, current and all-time best streaks per habit
- **Sidebar navigation** — click any habit to scroll directly to it; updates live on add/delete/edit
- **Search & filter** — filter habits by category or search by name from the header
- **Add / edit / delete habits** — inline name editing, color picker, category input with autocomplete
- **Dark mode** — toggle in the sidebar; preference persisted to localStorage
- **Toast notifications** — non-blocking feedback on add, edit, and delete actions
- **Fully offline** — all data stored in `localStorage`, no account or server needed

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Class utilities | clsx + tailwind-merge |
| Package manager | Bun |

## Installation

```bash
git clone <repo-url>
cd habit-tracker
bun install
```

## Run Locally

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
bun run build
```

Output goes to `dist/`. Preview the production build with:

```bash
bun run preview
```

## Folder Structure

```
src/
├── App.jsx                    # Root component — state, routing, layout
├── index.css                  # Global styles, CSS variables, keyframe animations
├── main.jsx                   # React entry point
│
├── views/
│   ├── TodayView.jsx          # Today dashboard
│   ├── WeeklyView.jsx         # Week grid with per-day toggles
│   ├── AnalyticsView.jsx      # Stats, category progress, heatmap
│   └── GoalsView.jsx          # Goal cards and per-habit streak table
│
├── components/
│   ├── Sidebar.jsx            # Navigation, habit list, theme toggle
│   ├── HabitRow.jsx           # Single habit row with inline edit and stats
│   ├── HabitCheckbox.jsx      # Animated checkbox for today's completion
│   ├── WeekHeader.jsx         # Column headers for the week grid
│   ├── HeatmapBlock.jsx       # 6-month activity heatmap
│   ├── ProgressBar.jsx        # Shared progress bar + CAT_COLORS constant
│   ├── StreakCard.jsx         # Stat card used across views
│   ├── QuoteBlock.jsx         # Motivational quote banner
│   ├── AddHabitModal.jsx      # Modal for creating a new habit
│   ├── DeleteConfirmModal.jsx # Confirmation dialog for deletion
│   └── Toast.jsx              # Toast notification system
│
├── hooks/
│   └── useTheme.js            # Dark/light mode toggle with localStorage
│
└── lib/
    ├── heatmap.js             # toDateStr + buildHeatmapData utilities
    └── utils.js               # cn() class-merging helper
```
