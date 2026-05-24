import { Search } from 'lucide-react'
import type { Filters } from '@/lib/jobs-data'
import type { JobSource } from '@/lib/jobs-data'

interface Props {
  filters: Filters
  onChange: (next: Filters) => void
}

const SOURCES: (JobSource | 'all')[] = ['all', 'USAJobs', 'Remotive', 'Jobicy']

export function FilterBar({ filters, onChange }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    onChange({ ...filters, [k]: v })

  return (
    <section className="bg-brand-card/40 backdrop-blur-sm p-4 rounded-xl border border-brand-border flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder="Title, company, skill…"
            className="w-full bg-brand-bg/60 border border-brand-border rounded-md pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
          Timeframe
        </label>
        <select
          value={filters.days}
          onChange={(e) => set('days', Number(e.target.value) as 1 | 7 | 30)}
          className="bg-brand-bg/60 border border-brand-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 w-44">
        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
          Min. Score <span className="font-mono text-brand-primary">{filters.minScore}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={filters.minScore}
          onChange={(e) => set('minScore', Number(e.target.value))}
          className="accent-brand-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
          Source
        </label>
        <select
          value={filters.source}
          onChange={(e) => set('source', e.target.value as Filters['source'])}
          className="bg-brand-bg/60 border border-brand-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All sources' : s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
          Sort by
        </label>
        <select
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value as Filters['sort'])}
          className="bg-brand-bg/60 border border-brand-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
        >
          <option value="score">Match score</option>
          <option value="date">Most recent</option>
          <option value="salary">Salary (high → low)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => set('remoteOnly', !filters.remoteOnly)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-brand-border hover:bg-brand-card transition-colors"
        aria-pressed={filters.remoteOnly}
      >
        <span className="text-sm text-foreground">Remote only</span>
        <span
          className={`w-9 h-5 rounded-full relative transition-colors ${
            filters.remoteOnly ? 'bg-brand-primary' : 'bg-brand-border'
          }`}
        >
          <span
            className={`size-4 bg-white rounded-full absolute top-0.5 transition-all ${
              filters.remoteOnly ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </span>
      </button>
    </section>
  )
}
