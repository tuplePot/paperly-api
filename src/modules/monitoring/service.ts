import { StatusCheck } from './model'
import type { ServiceId, CheckResult } from './types'

const SERVICES: Array<{ id: ServiceId; name: string; envKey: string }> = [
  { id: 'memoria',       name: 'Memoria (Todolist)',  envKey: 'MEMORIA_HEALTH_URL' },
  { id: 'paperly',       name: 'Paperly (eReader)',   envKey: 'PAPERLY_HEALTH_URL' },
  { id: 'cms-portfolio', name: 'CMS Portfolio',       envKey: 'CMS_PORTFOLIO_HEALTH_URL' },
  { id: 'cms-blog',      name: 'CMS Blog',            envKey: 'CMS_BLOG_HEALTH_URL' },
]

const TIMEOUT_MS = 5_000

async function pingService(
  id: ServiceId,
  url: string,
): Promise<CheckResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const start = Date.now()
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    return {
      service: id,
      status: res.ok ? 'up' : 'down',
      responseTimeMs: Date.now() - start,
      checkedAt: new Date(),
      errorMessage: res.ok ? undefined : `HTTP ${res.status}`,
    }
  } catch (err) {
    clearTimeout(timer)
    return {
      service: id,
      status: 'down',
      responseTimeMs: Date.now() - start,
      checkedAt: new Date(),
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

export async function checkAllServices(): Promise<CheckResult[]> {
  const results = await Promise.all(
    SERVICES.map(({ id, envKey }) => {
      const url = process.env[envKey]
      if (!url) {
        return {
          service: id,
          status: 'down' as const,
          responseTimeMs: 0,
          checkedAt: new Date(),
          errorMessage: `Missing env var ${envKey}`,
        }
      }
      return pingService(id, url)
    }),
  )
  await StatusCheck.insertMany(results)
  return results
}

// ── Status summary ─────────────────────────────────────────────────────────

type BarStatus = 'up' | 'down' | 'partial' | 'no-data'

interface DayBar {
  date: string
  status: BarStatus
  upCount: number
  downCount: number
}

interface ServiceSummary {
  id: string
  name: string
  bars: DayBar[]
  uptimePct: number
  currentStatus: 'up' | 'down' | 'no-data'
}

interface Incident {
  service: string
  start: string
  end: string | null
  downCount: number
}

export interface MonitoringData {
  lastChecked: string | null
  services: ServiceSummary[]
  incidents: Incident[]
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function buildDayBars(
  grouped: Map<string, { up: number; down: number }>,
  days: string[],
): DayBar[] {
  return days.map((d) => {
    const bucket = grouped.get(d)
    if (!bucket) return { date: d, status: 'no-data', upCount: 0, downCount: 0 }
    const { up, down } = bucket
    let status: BarStatus = 'up'
    if (up === 0 && down > 0) status = 'down'
    else if (down > 0) status = 'partial'
    return { date: d, status, upCount: up, downCount: down }
  })
}

function detectIncidents(
  checks: Array<{ service: string; status: string; checkedAt: Date }>,
): Incident[] {
  const byService = new Map<string, typeof checks>()
  for (const c of checks) {
    if (!byService.has(c.service)) byService.set(c.service, [])
    byService.get(c.service)!.push(c)
  }

  const incidents: Incident[] = []

  for (const [svc, rows] of byService) {
    const sorted = [...rows].sort(
      (a, b) => a.checkedAt.getTime() - b.checkedAt.getTime(),
    )
    let streakStart: Date | null = null
    let streakCount = 0

    for (const row of sorted) {
      if (row.status === 'down') {
        if (!streakStart) streakStart = row.checkedAt
        streakCount++
      } else {
        if (streakStart && streakCount >= 2) {
          incidents.push({
            service: svc,
            start: streakStart.toISOString(),
            end: row.checkedAt.toISOString(),
            downCount: streakCount,
          })
        }
        streakStart = null
        streakCount = 0
      }
    }
    if (streakStart && streakCount >= 2) {
      incidents.push({
        service: svc,
        start: streakStart.toISOString(),
        end: null,
        downCount: streakCount,
      })
    }
  }

  return incidents.sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
  )
}

export async function getStatusSummary(): Promise<MonitoringData> {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 89)
  since.setUTCHours(0, 0, 0, 0)

  const checks = await StatusCheck.find(
    { checkedAt: { $gte: since } },
    { service: 1, status: 1, checkedAt: 1, _id: 0 },
  ).lean()

  const latest = await StatusCheck.findOne({}, { checkedAt: 1, _id: 0 })
    .sort({ checkedAt: -1 })
    .lean()

  // build 90-day window labels
  const days: string[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    days.push(dateKey(d))
  }

  // group by service → date → up/down counts
  const grouped = new Map<string, Map<string, { up: number; down: number }>>()
  for (const c of checks) {
    if (!grouped.has(c.service)) grouped.set(c.service, new Map())
    const key = dateKey(c.checkedAt)
    const svcMap = grouped.get(c.service)!
    if (!svcMap.has(key)) svcMap.set(key, { up: 0, down: 0 })
    const bucket = svcMap.get(key)!
    if (c.status === 'up') bucket.up++
    else bucket.down++
  }

  const services: ServiceSummary[] = SERVICES.map(({ id, name }) => {
    const svcMap = grouped.get(id) ?? new Map<string, { up: number; down: number }>()
    const bars = buildDayBars(svcMap, days)
    const dataBars = bars.filter((b) => b.status !== 'no-data')
    const upBars = dataBars.filter((b) => b.status === 'up').length
    const uptimePct =
      dataBars.length > 0
        ? Math.round((upBars / dataBars.length) * 1000) / 10
        : 100

    const lastChecks = checks
      .filter((c) => c.service === id)
      .sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime())
    const currentStatus =
      lastChecks.length === 0
        ? 'no-data'
        : lastChecks[0].status === 'up'
          ? 'up'
          : 'down'

    return { id, name, bars, uptimePct, currentStatus }
  })

  return {
    lastChecked: latest?.checkedAt.toISOString() ?? null,
    services,
    incidents: detectIncidents(checks),
  }
}
