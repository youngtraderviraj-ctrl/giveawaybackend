import { supabaseAdmin } from '@/lib/supabase/admin'
import type {
  Giveaway,
  Entry,
  Winner,
  GiveawayStatus,
  WinnerStatus,
  DashboardStats,
  ActivityFeedItem,
} from '@/lib/types'

// ---------- Raw DB row shapes (snake_case) ----------
export interface GiveawayRow {
  id: string
  name: string
  prize: string
  description: string | null
  banner_url: string | null
  winners_count: number
  start_date: string | null
  end_date: string | null
  status: GiveawayStatus
  multiple_entries: boolean
  email_verification: boolean
  lifetime_winner_restrict: boolean
  created_at: string
  updated_at: string
}

export interface EntryRow {
  id: string
  giveaway_id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  is_verified: boolean
  source: string | null
  created_at: string
}

export interface WinnerRow {
  id: string
  entry_id: string
  giveaway_id: string
  email: string
  prize: string | null
  status: WinnerStatus
  won_at: string
  contacted_at: string | null
  claimed_at: string | null
}

// ---------- Mappers (DB row -> app type) ----------
export function mapGiveaway(r: GiveawayRow, totalEntries = 0): Giveaway {
  return {
    id: r.id,
    name: r.name,
    prize: r.prize,
    description: r.description ?? '',
    banner: r.banner_url ?? undefined,
    totalEntries,
    winners: r.winners_count,
    startDate: r.start_date ? new Date(r.start_date) : new Date(),
    endDate: r.end_date ? new Date(r.end_date) : new Date(),
    status: r.status,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
    rules: {
      multipleEntries: r.multiple_entries,
      emailVerificationRequired: r.email_verification,
      lifetimeWinnerRestriction: r.lifetime_winner_restrict,
    },
  }
}

export function mapEntry(r: EntryRow): Entry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? '',
    country: r.country ?? '',
    giveawayId: r.giveaway_id,
    entryDate: new Date(r.created_at),
    isVerified: r.is_verified,
    source: (r.source as Entry['source']) ?? 'Website',
  }
}

export function mapWinner(r: WinnerRow, name = '', country = ''): Winner {
  return {
    id: r.id,
    entryId: r.entry_id,
    giveawayId: r.giveaway_id,
    name,
    email: r.email,
    country,
    prize: r.prize ?? '',
    wonDate: new Date(r.won_at),
    status: r.status,
    contactedDate: r.contacted_at ? new Date(r.contacted_at) : undefined,
    claimedDate: r.claimed_at ? new Date(r.claimed_at) : undefined,
  }
}

// ---------- Admin queries (server-only) ----------
export async function getGiveaways(): Promise<Giveaway[]> {
  const supabase = supabaseAdmin()
  const { data: giveaways, error } = await supabase
    .from('giveaways')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  // entry counts per giveaway
  const { data: entries } = await supabase.from('entries').select('giveaway_id')
  const counts = new Map<string, number>()
  for (const e of entries ?? []) {
    counts.set(e.giveaway_id, (counts.get(e.giveaway_id) ?? 0) + 1)
  }

  return (giveaways as GiveawayRow[]).map((g) => mapGiveaway(g, counts.get(g.id) ?? 0))
}

export async function getEntries(giveawayId?: string): Promise<Entry[]> {
  const supabase = supabaseAdmin()
  let query = supabase.from('entries').select('*').order('created_at', { ascending: false })
  if (giveawayId) query = query.eq('giveaway_id', giveawayId)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data as EntryRow[]).map(mapEntry)
}

export async function getWinners(): Promise<Winner[]> {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('winners')
    .select('*, entries(name, country)')
    .order('won_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as (WinnerRow & { entries: { name: string; country: string } | null })[]).map((w) =>
    mapWinner(w, w.entries?.name ?? '', w.entries?.country ?? '')
  )
}

export async function getStats(): Promise<DashboardStats> {
  const supabase = supabaseAdmin()
  const [giveaways, entries, winners] = await Promise.all([
    supabase.from('giveaways').select('id, status'),
    supabase.from('entries').select('id', { count: 'exact', head: true }),
    supabase.from('winners').select('id', { count: 'exact', head: true }),
  ])

  const totalGiveaways = giveaways.data?.length ?? 0
  const activeGiveaways = (giveaways.data ?? []).filter((g) => g.status === 'Live').length
  const totalEntries = entries.count ?? 0
  const totalWinners = winners.count ?? 0
  const conversionRate = totalEntries > 0 ? Math.round((totalWinners / totalEntries) * 1000) / 10 : 0

  return { totalGiveaways, totalEntries, totalWinners, conversionRate, activeGiveaways }
}

/** Builds a recent-activity feed by merging latest entries, winners and giveaways. */
export async function getRecentActivity(limit = 6): Promise<ActivityFeedItem[]> {
  const supabase = supabaseAdmin()
  const [entries, winners, giveaways] = await Promise.all([
    supabase.from('entries').select('id, name, giveaway_id, created_at').order('created_at', { ascending: false }).limit(limit),
    supabase.from('winners').select('id, email, giveaway_id, won_at').order('won_at', { ascending: false }).limit(limit),
    supabase.from('giveaways').select('id, name, created_at, status').order('created_at', { ascending: false }).limit(limit),
  ])

  const items: ActivityFeedItem[] = []

  for (const e of entries.data ?? []) {
    items.push({
      id: `entry-${e.id}`,
      type: 'EntryReceived',
      title: 'New Entry Received',
      description: `${e.name} entered a giveaway`,
      timestamp: new Date(e.created_at),
      giveawayId: e.giveaway_id,
      icon: 'UserPlus',
    })
  }
  for (const w of winners.data ?? []) {
    items.push({
      id: `winner-${w.id}`,
      type: 'WinnersDrawn',
      title: 'Winner Drawn',
      description: `${w.email} won a prize`,
      timestamp: new Date(w.won_at),
      giveawayId: w.giveaway_id,
      icon: 'Trophy',
    })
  }
  for (const g of giveaways.data ?? []) {
    items.push({
      id: `giveaway-${g.id}`,
      type: g.status === 'Closed' ? 'GiveawayEnded' : 'GiveawayCreated',
      title: g.status === 'Closed' ? 'Giveaway Closed' : 'Giveaway Created',
      description: g.name,
      timestamp: new Date(g.created_at),
      giveawayId: g.id,
      icon: g.status === 'Closed' ? 'XCircle' : 'Gift',
    })
  }

  return items
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

export interface AnalyticsData {
  totalEntries: number
  totalWinners: number
  conversionRate: number
  countriesCount: number
  dailyEntries: { date: string; entries: number }[]
  giveawayPerformance: { name: string; entries: number }[]
  countryData: { country: string; entries: number; percentage: number }[]
  sources: { source: string; entries: number }[]
}

export async function getAnalytics(days = 14): Promise<AnalyticsData> {
  const supabase = supabaseAdmin()
  const [entriesRes, giveawaysRes, winnersRes] = await Promise.all([
    supabase.from('entries').select('country, source, created_at, giveaway_id'),
    supabase.from('giveaways').select('id, name'),
    supabase.from('winners').select('id', { count: 'exact', head: true }),
  ])

  const entries = entriesRes.data ?? []
  const giveaways = giveawaysRes.data ?? []
  const totalEntries = entries.length
  const totalWinners = winnersRes.count ?? 0
  const conversionRate = totalEntries > 0 ? Math.round((totalWinners / totalEntries) * 1000) / 10 : 0

  // Daily entries for the last `days` days.
  const dayBuckets = new Map<string, number>()
  const labels: { key: string; date: string }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dayBuckets.set(key, 0)
    labels.push({ key, date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })
  }
  for (const e of entries) {
    const key = new Date(e.created_at).toISOString().slice(0, 10)
    if (dayBuckets.has(key)) dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1)
  }
  const dailyEntries = labels.map((l) => ({ date: l.date, entries: dayBuckets.get(l.key) ?? 0 }))

  // Entries per giveaway.
  const nameById = new Map(giveaways.map((g) => [g.id, g.name]))
  const perGiveaway = new Map<string, number>()
  for (const e of entries) perGiveaway.set(e.giveaway_id, (perGiveaway.get(e.giveaway_id) ?? 0) + 1)
  const giveawayPerformance = [...perGiveaway.entries()]
    .map(([id, count]) => ({ name: nameById.get(id) ?? 'Unknown', entries: count }))
    .sort((a, b) => b.entries - a.entries)

  // Country distribution.
  const perCountry = new Map<string, number>()
  for (const e of entries) {
    const c = e.country?.trim() || 'Unknown'
    perCountry.set(c, (perCountry.get(c) ?? 0) + 1)
  }
  const countryData = [...perCountry.entries()]
    .map(([country, count]) => ({
      country,
      entries: count,
      percentage: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
    }))
    .sort((a, b) => b.entries - a.entries)
    .slice(0, 8)
  const countriesCount = perCountry.size

  // Traffic sources.
  const perSource = new Map<string, number>()
  for (const e of entries) {
    const s = e.source?.trim() || 'Direct'
    perSource.set(s, (perSource.get(s) ?? 0) + 1)
  }
  const sources = [...perSource.entries()]
    .map(([source, count]) => ({ source, entries: count }))
    .sort((a, b) => b.entries - a.entries)

  return {
    totalEntries,
    totalWinners,
    conversionRate,
    countriesCount,
    dailyEntries,
    giveawayPerformance,
    countryData,
    sources,
  }
}
