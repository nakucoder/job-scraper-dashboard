import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string
  icon: LucideIcon
  tone?: 'default' | 'primary' | 'secondary' | 'accent'
  hint?: string
}

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  default: 'text-foreground',
  primary: 'text-brand-primary',
  secondary: 'text-brand-secondary',
  accent: 'text-brand-accent',
}

export function StatCard({ label, value, icon: Icon, tone = 'default', hint }: Props) {
  return (
    <div className="bg-brand-card border border-brand-border p-5 rounded-xl group hover:border-brand-border/80 transition-colors">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <Icon className="size-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
      </div>
      <p className={`mt-3 text-3xl font-mono font-medium tracking-tight ${toneClass[tone]}`}>
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] font-mono text-muted-foreground/80">{hint}</p>
      )}
    </div>
  )
}
