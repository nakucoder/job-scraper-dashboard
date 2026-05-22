import type { Job } from '@/lib/jobs-data'

interface Props {
  jobs: Job[]
}

export function PriorityGaps({ jobs }: Props) {
  const counts = new Map<string, number>()
  jobs
    .filter((j) => j.score >= 50 && j.score < 85)
    .forEach((j) =>
      j.violations.forEach((v) => {
        const key = v.detail.split(/[.(]/)[0].trim().slice(0, 60)
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }),
    )

  const gaps = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)

  if (gaps.length === 0) return null

  return (
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">Priority skill gaps</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Recurring blockers across stretch-zone listings · invest here next
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {gaps.map(([gap, n], i) => (
          <div
            key={gap}
            className="shrink-0 bg-brand-card border border-brand-border rounded-xl p-4 w-44 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between">
              <span className="text-xl font-mono font-bold text-brand-accent">×{n}</span>
              <span className="text-[9px] font-mono text-muted-foreground/50">#{i + 1}</span>
            </div>
            <p className="text-sm text-foreground/90 leading-snug">{gap}</p>
            <div className="h-0.5 bg-brand-accent/30 rounded-full mt-auto">
              <div
                className="h-full bg-brand-accent rounded-full"
                style={{ width: `${Math.min(100, n * 25)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
