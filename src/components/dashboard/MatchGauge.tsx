interface Props {
  avg: number
  total: number
  strong: number
  remote: number
  sources: number
}

export function MatchGauge({ avg, total, strong, remote, sources }: Props) {
  const R = 64
  const strokeW = 8
  const circ = 2 * Math.PI * R
  const arcLen = circ * 0.75
  const filled = arcLen * (avg / 100)

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col items-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
        Match Index · Realtime
      </p>

      <div className="relative w-40 h-40">
        <svg viewBox="0 0 160 160" className="w-full h-full">
          {/* Background track */}
          <circle
            cx={80} cy={80} r={R}
            fill="none"
            stroke="oklch(0.27 0.008 286)"
            strokeWidth={strokeW}
            strokeDasharray={`${arcLen} ${circ - arcLen}`}
            strokeLinecap="round"
            transform="rotate(135 80 80)"
          />
          {/* Filled arc */}
          <circle
            cx={80} cy={80} r={R}
            fill="none"
            stroke="oklch(0.71 0.16 162)"
            strokeWidth={strokeW}
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeLinecap="round"
            transform="rotate(135 80 80)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-mono font-bold text-brand-primary">
            {avg.toFixed(1)}%
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Avg Fit
          </span>
          <span className="text-[10px] font-mono text-brand-primary/70">
            across {total} listings
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6 w-full border-t border-brand-border pt-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-mono font-bold text-brand-primary">{strong}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Strong</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-mono font-bold text-brand-secondary">{remote}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Remote</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-mono font-bold text-brand-accent">{sources}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Sources</span>
        </div>
      </div>
    </div>
  )
}
