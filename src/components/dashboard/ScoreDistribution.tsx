import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Job } from '@/lib/jobs-data'

interface Props {
  jobs: Job[]
}

const BUCKETS = [
  { label: '0–25%',   min: 0,  max: 25,  color: 'oklch(0.65 0.22 25)' },
  { label: '25–50%',  min: 25, max: 50,  color: 'oklch(0.78 0.16 78)' },
  { label: '50–75%',  min: 50, max: 75,  color: 'oklch(0.68 0.18 252)' },
  { label: '75–100%', min: 75, max: 101, color: 'oklch(0.71 0.16 162)' },
]

export function ScoreDistribution({ jobs }: Props) {
  const data = BUCKETS.map((b) => ({
    name: b.label,
    count: jobs.filter((j) => j.score >= b.min && j.score < b.max).length,
    color: b.color,
  }))

  return (
    <section className="bg-brand-card border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-wide">
          Score Distribution Profile
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {jobs.length} listings scored
        </span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'oklch(0.65 0.01 286)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'oklch(0.55 0.01 286)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'oklch(0.27 0.008 286 / 0.4)' }}
              contentStyle={{
                background: 'oklch(0.215 0.006 286)',
                border: '1px solid oklch(0.27 0.008 286)',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                color: 'oklch(0.97 0.005 286)',
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
