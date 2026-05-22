import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts'
import type { Job } from '@/lib/jobs-data'

interface Props {
  jobs: Job[]
}

const DOMAINS = [
  { key: 'Cloud',    pattern: /cloud|solutions architect|cloud architect/i },
  { key: 'Backend',  pattern: /backend|distributed|platform engineer|microservice|api engineer|golang|grpc/i },
  { key: 'DevOps',   pattern: /devops|sre|site reliability|infrastructure|platform|kubernetes|terraform|observability/i },
  { key: 'Data',     pattern: /data|analytics|snowflake|kafka|machine learning|ml engineer|ai engineer/i },
  { key: 'Security', pattern: /security|compliance|zero trust|cissp|clearance/i },
  { key: 'Frontend', pattern: /frontend|front-end|ui engineer|react developer|javascript/i },
]

function domainScore(jobs: Job[], pattern: RegExp): number {
  // Match against title only — cloud provider field would make Cloud dominate everything
  const matched = jobs.filter((j) => pattern.test(j.title))
  if (matched.length === 0) return 0
  return Math.round(matched.reduce((s, j) => s + j.score, 0) / matched.length)
}

export function SkillRadar({ jobs }: Props) {
  const data = DOMAINS.map((d) => ({
    domain: d.key,
    score: domainScore(jobs, d.pattern),
  }))

  const hasData = data.some((d) => d.score > 0)

  if (jobs.length === 0) return null

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Skill Coverage</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Avg match score per domain — based on today&apos;s job titles
          </p>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest border border-brand-border px-2 py-1 rounded text-muted-foreground">
          Radar
        </span>
      </div>
      {!hasData && (
        <p className="text-sm text-muted-foreground italic py-8 text-center">
          Not enough domain variety in today&apos;s listings to render the radar.
        </p>
      )}
      <div className={`h-56 ${!hasData ? 'hidden' : ''}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="oklch(0.27 0.008 286)" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fill: 'oklch(0.65 0.01 286)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'oklch(0.45 0.01 286)', fontSize: 9 }}
              tickCount={4}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="oklch(0.71 0.16 162)"
              fill="oklch(0.71 0.16 162)"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: 'oklch(0.215 0.006 286)',
                border: '1px solid oklch(0.27 0.008 286)',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                color: 'oklch(0.97 0.005 286)',
              }}
              formatter={(v) => [`${v ?? 0}%`, 'Avg score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
