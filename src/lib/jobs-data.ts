import axios from 'axios'

export type JobSource = 'USAJobs' | 'Remotive' | 'Jobicy'
export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'Multi-cloud' | 'On-prem'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  remote: boolean
  salaryMin: number
  salaryMax: number
  score: number
  source: JobSource
  cloud: CloudProvider
  postedDaysAgo: number
  tags: string[]
  violations: { label: string; detail: string }[]
  upskill: string
  url: string
}

export interface Filters {
  days: 1 | 7 | 30
  minScore: number
  source: JobSource | 'all'
  remoteOnly: boolean
  query: string
  sort: 'score' | 'date' | 'salary'
}

interface ApiJob {
  title: string
  company: string
  location: string
  is_remote: boolean
  estimated_salary_min?: number
  estimated_salary_max?: number
  match_score_percent: number
  primary_cloud?: string
  source: string
  constraint_violations?: string[]
  upskill_recommendations?: string[]
  url: string
}

const API_URL = 'https://q0xo68b302.execute-api.us-east-1.amazonaws.com/Prod/jobs'

function parseViolations(violations: string[]): { label: string; detail: string }[] {
  return violations.map((v) => {
    const colonIdx = v.indexOf(':')
    if (colonIdx > 0 && colonIdx < 25) {
      return { label: v.slice(0, colonIdx).trim(), detail: v.slice(colonIdx + 1).trim() }
    }
    return { label: 'Gap', detail: v }
  })
}

function deriveTags(job: ApiJob): string[] {
  const tags: string[] = []
  if (job.primary_cloud) tags.push(job.primary_cloud)
  const text = `${job.title} ${(job.constraint_violations ?? []).join(' ')}`.toLowerCase()
  if (/kubernetes|k8s/.test(text)) tags.push('Kubernetes')
  if (/terraform/.test(text)) tags.push('Terraform')
  if (/typescript/.test(text)) tags.push('TypeScript')
  if (/\breact\b/.test(text)) tags.push('React')
  if (/golang|\bgo\b/.test(text)) tags.push('Go')
  if (/\brust\b/.test(text)) tags.push('Rust')
  if (/postgresql|postgres/.test(text)) tags.push('PostgreSQL')
  if (/kafka/.test(text)) tags.push('Kafka')
  if (/\bsql\b/.test(text)) tags.push('SQL')
  if (/grpc/.test(text)) tags.push('gRPC')
  return [...new Set(tags)].slice(0, 5)
}

function mapJob(job: ApiJob, idx: number): Job {
  return {
    id: `job-${idx}-${Date.now()}`,
    title: job.title,
    company: job.company,
    location: job.location,
    remote: job.is_remote,
    salaryMin: job.estimated_salary_min ?? 0,
    salaryMax: job.estimated_salary_max ?? 0,
    score: job.match_score_percent,
    source: job.source as JobSource,
    cloud: (job.primary_cloud ?? 'AWS') as CloudProvider,
    postedDaysAgo: 1,
    tags: deriveTags(job),
    violations: parseViolations(job.constraint_violations ?? []),
    upskill: (job.upskill_recommendations ?? []).join('. '),
    url: job.url,
  }
}

export async function fetchJobs(params: {
  days: number
  min_score?: number
  remote_only?: boolean
  source?: string
}): Promise<Job[]> {
  const p = new URLSearchParams()
  p.set('days', String(params.days))
  if (params.min_score) p.set('min_score', String(params.min_score))
  if (params.remote_only) p.set('remote_only', 'true')
  if (params.source && params.source !== 'all') p.set('source', params.source)

  const res = await axios.get<{ jobs: ApiJob[] }>(`${API_URL}?${p.toString()}`)
  return (res.data.jobs ?? []).map(mapJob)
}
