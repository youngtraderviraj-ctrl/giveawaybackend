export type GiveawayStatus = 'Draft' | 'Scheduled' | 'Live' | 'Closed'
export type WinnerStatus = 'Pending' | 'Contacted' | 'Claimed' | 'Unclaimed'
export type ActivityType = 'GiveawayCreated' | 'GiveawayEnded' | 'WinnersDrawn' | 'EntryReceived'

export const BROKERS = ['XM', 'Xellion', 'Exness', 'Delta Exchange', 'Dhan'] as const
export type Broker = (typeof BROKERS)[number]

export interface Giveaway {
  id: string
  name: string
  prize: string
  description: string
  banner?: string
  totalEntries: number
  winners: number
  startDate: Date
  endDate: Date
  status: GiveawayStatus
  createdAt: Date
  updatedAt: Date
  rules?: {
    multipleEntries: boolean
    brokerVerificationRequired: boolean
    lifetimeWinnerRestriction: boolean
  }
}

export interface Entry {
  id: string
  name: string
  email: string
  whatsappNumber: string
  broker: Broker | ''
  accountId: string
  giveawayId: string
  entryDate: Date
  isVerified: boolean
  source: 'Website' | 'Email' | 'Social' | 'Direct'
}

export interface Winner {
  id: string
  entryId: string
  giveawayId: string
  name: string
  email: string
  whatsappNumber: string
  broker: Broker | ''
  accountId: string
  prize: string
  wonDate: Date
  status: WinnerStatus
  contactedDate?: Date
  claimedDate?: Date
}

export interface ActivityFeedItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  icon?: string
  giveawayId?: string
}

export interface DashboardStats {
  totalGiveaways: number
  totalEntries: number
  totalWinners: number
  conversionRate: number
  activeGiveaways: number
}

export interface ChartData {
  date: string
  value: number
  entries?: number
  percentage?: number
}

export interface CountryData {
  country: string
  entries: number
  percentage: number
}
