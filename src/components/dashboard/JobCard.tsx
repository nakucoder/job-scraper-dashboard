import { ArrowUpRight, Bookmark, AlertTriangle, Sparkles, MapPin, Building2 } from 'lucide-react'
import type { Job } from '@/lib/jobs-data'

interface Props {
  job: Job
  bookmarked: boolean
  onToggleBookmark: () => void
}

function scoreTier(score: number) {
  if (score >= 85) return {
    label: 'Strong',
    text: 'text-brand-primary',
    bar: 'bg-brand-primary',
    ring: 'oklch(0.71 0.16 162)',
    badge: 'bg-brand-primary/10 text-brand-primary',
  }
  if (score >= 70) return {
    label: 'Good',
    text: 'text-brand-secondary',
    bar: 'bg-brand-secondary',
    ring: 'oklch(0.68 0.18 252)',
    badge: 'bg-brand-secondary/10 text-brand-secondary',
  }
  if (score >= 50) return {
    label: 'Stretch',
    text: 'text-brand-accent',
    bar: 'bg-brand-accent',
    ring: 'oklch(0.78 0.16 78)',
    badge: 'bg-brand-accent/10 text-brand-accent',
  }
  return {
    label: 'Long shot',
    text: 'text-brand-danger',
    bar: 'bg-brand-danger/60',
    ring: 'oklch(0.65 0.22 25)',
    badge: 'bg-brand-danger/10 text-brand-danger',
  }
}

function fmtSalary(min: number, max: number) {
  if (!min && !max) return null
  const k = (n: number) => `$${Math.round(n / 1000)}k`
  return `${k(min)} → ${k(max)}`
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const R = 34
  const strokeW = 5
  const circ = 2 * Math.PI * R
  const filled = circ * (score / 100)

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx={40} cy={40} r={R} fill="none" stroke="oklch(0.27 0.008 286)" strokeWidth={strokeW} />
        <circle
          cx={40} cy={40} r={R} fill="none"
          stroke={color} strokeWidth={strokeW}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-mono font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  )
}

export function JobCard({ job, bookmarked, onToggleBookmark }: Props) {
  const tier = scoreTier(job.score)
  const salary = fmtSalary(job.salaryMin, job.salaryMax)

  return (
    <article className="relative bg-brand-card border border-brand-border rounded-xl overflow-hidden group hover:border-brand-border/80 transition-colors">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${tier.bar}`} />

      <div className="pl-5 pr-6 pt-5 pb-5">
        <header className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`${tier.badge} text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter`}>
                {tier.label}
              </span>
              {job.remote && (
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  Remote
                </span>
              )}
              <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">
                {job.source} · {job.cloud} · {job.postedDaysAgo}d ago
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground font-medium mt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {job.location}
              </span>
              {salary && (
                <span className="font-mono text-foreground/80">{salary}</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 shrink-0">
            <button
              type="button"
              onClick={onToggleBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Save job'}
              className="p-2 rounded-md border border-brand-border hover:border-brand-primary/50 transition-colors"
            >
              <Bookmark
                className={`size-4 ${bookmarked ? 'fill-brand-primary text-brand-primary' : 'text-muted-foreground'}`}
              />
            </button>
            <ScoreRing score={job.score} color={tier.ring} />
          </div>
        </header>

        {(job.violations.length > 0 || job.upskill) && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-brand-border">
            <div>
              <h4 className="text-[10px] font-bold text-brand-accent uppercase mb-3 flex items-center gap-1.5 tracking-wider">
                <AlertTriangle className="size-3.5" /> Gaps
              </h4>
              {job.violations.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No gaps — full requirements met.</p>
              ) : (
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  {job.violations.map((v, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brand-accent shrink-0">›</span>
                      <span>
                        <span className="text-foreground/90 font-medium">{v.label}:</span>{' '}
                        {v.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {job.upskill && (
              <div>
                <h4 className="text-[10px] font-bold text-brand-secondary uppercase mb-3 flex items-center gap-1.5 tracking-wider">
                  <Sparkles className="size-3.5" /> Upskill Path
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.upskill}</p>
              </div>
            )}
          </div>
        )}

        <footer className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {job.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 bg-brand-bg/60 border border-brand-border text-muted-foreground rounded text-[10px] font-mono"
              >
                {t}
              </span>
            ))}
          </div>
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className={`${tier.text} text-sm font-semibold hover:underline flex items-center gap-1`}
          >
            Apply
            <ArrowUpRight className="size-4" />
          </a>
        </footer>
      </div>
    </article>
  )
}
