import type { Giveaway, Entry, Winner, ActivityFeedItem, ChartData, CountryData } from './types'

// Sample Giveaways
export const SAMPLE_GIVEAWAYS: Giveaway[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max Launch Giveaway',
    prize: 'iPhone 15 Pro Max 256GB',
    description: 'Celebrating the launch of our new product with an exclusive iPhone giveaway. Follow us, retweet, and tag a friend to enter!',
    banner: '/giveaway-1.jpg',
    totalEntries: 12847,
    winners: 3,
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-30'),
    status: 'Live',
    createdAt: new Date('2025-05-25'),
    updatedAt: new Date('2025-06-14'),
    rules: {
      multipleEntries: true,
      emailVerificationRequired: true,
      lifetimeWinnerRestriction: true,
    },
  },
  {
    id: '2',
    name: 'MacBook Pro Giveaway',
    prize: 'MacBook Pro 16" M4',
    description: 'Enter to win a brand new MacBook Pro 16-inch with M4 chip!',
    totalEntries: 8234,
    winners: 1,
    startDate: new Date('2025-05-15'),
    endDate: new Date('2025-06-15'),
    status: 'Live',
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-06-14'),
    rules: {
      multipleEntries: false,
      emailVerificationRequired: true,
      lifetimeWinnerRestriction: true,
    },
  },
  {
    id: '3',
    name: 'AirPods Max Bundle',
    prize: 'AirPods Max + Apple Watch Ultra',
    description: 'Win premium Apple audio and wearable tech!',
    totalEntries: 5621,
    winners: 2,
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-31'),
    status: 'Closed',
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-06-01'),
    rules: {
      multipleEntries: true,
      emailVerificationRequired: false,
      lifetimeWinnerRestriction: false,
    },
  },
  {
    id: '4',
    name: 'Summer Giveaway Series - Scheduled',
    prize: 'Multiple Prizes Worth $5000',
    description: 'Our biggest summer giveaway is coming soon!',
    totalEntries: 0,
    winners: 5,
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-08-31'),
    status: 'Scheduled',
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-14'),
    rules: {
      multipleEntries: true,
      emailVerificationRequired: true,
      lifetimeWinnerRestriction: true,
    },
  },
]

// Sample Entries
export const SAMPLE_ENTRIES: Entry[] = [
  {
    id: 'entry-1',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    phone: '+1-555-0101',
    country: 'United States',
    giveawayId: '1',
    entryDate: new Date('2025-06-10'),
    isVerified: true,
    source: 'Website',
  },
  {
    id: 'entry-2',
    name: 'James Chen',
    email: 'james.chen@email.com',
    phone: '+1-555-0102',
    country: 'Canada',
    giveawayId: '1',
    entryDate: new Date('2025-06-11'),
    isVerified: true,
    source: 'Social',
  },
  {
    id: 'entry-3',
    name: 'Emma Rodriguez',
    email: 'emma.r@email.com',
    phone: '+34-555-0103',
    country: 'Spain',
    giveawayId: '1',
    entryDate: new Date('2025-06-12'),
    isVerified: false,
    source: 'Email',
  },
  {
    id: 'entry-4',
    name: 'Michael Thompson',
    email: 'mthompson@email.com',
    phone: '+44-555-0104',
    country: 'United Kingdom',
    giveawayId: '1',
    entryDate: new Date('2025-06-12'),
    isVerified: true,
    source: 'Direct',
  },
  {
    id: 'entry-5',
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    phone: '+86-555-0105',
    country: 'China',
    giveawayId: '1',
    entryDate: new Date('2025-06-13'),
    isVerified: true,
    source: 'Website',
  },
  {
    id: 'entry-6',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+82-555-0106',
    country: 'South Korea',
    giveawayId: '2',
    entryDate: new Date('2025-06-08'),
    isVerified: true,
    source: 'Social',
  },
  {
    id: 'entry-7',
    name: 'Sophie Martin',
    email: 'sophie.m@email.com',
    phone: '+33-555-0107',
    country: 'France',
    giveawayId: '2',
    entryDate: new Date('2025-06-09'),
    isVerified: true,
    source: 'Website',
  },
  {
    id: 'entry-8',
    name: 'Marco Rossi',
    email: 'marco.rossi@email.com',
    phone: '+39-555-0108',
    country: 'Italy',
    giveawayId: '2',
    entryDate: new Date('2025-06-10'),
    isVerified: false,
    source: 'Email',
  },
  {
    id: 'entry-9',
    name: 'Yuki Tanaka',
    email: 'yuki.t@email.com',
    phone: '+81-555-0109',
    country: 'Japan',
    giveawayId: '3',
    entryDate: new Date('2025-05-20'),
    isVerified: true,
    source: 'Website',
  },
  {
    id: 'entry-10',
    name: 'Aria Sharma',
    email: 'aria.sharma@email.com',
    phone: '+91-555-0110',
    country: 'India',
    giveawayId: '3',
    entryDate: new Date('2025-05-22'),
    isVerified: true,
    source: 'Social',
  },
]

// Sample Winners
export const SAMPLE_WINNERS: Winner[] = [
  {
    id: 'winner-1',
    entryId: 'entry-1',
    giveawayId: '3',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    country: 'United States',
    prize: 'AirPods Max + Apple Watch Ultra',
    wonDate: new Date('2025-05-31'),
    status: 'Claimed',
    contactedDate: new Date('2025-06-01'),
    claimedDate: new Date('2025-06-05'),
  },
  {
    id: 'winner-2',
    entryId: 'entry-9',
    giveawayId: '3',
    name: 'Yuki Tanaka',
    email: 'yuki.t@email.com',
    country: 'Japan',
    prize: 'AirPods Max + Apple Watch Ultra',
    wonDate: new Date('2025-05-31'),
    status: 'Claimed',
    contactedDate: new Date('2025-06-01'),
    claimedDate: new Date('2025-06-08'),
  },
  {
    id: 'winner-3',
    entryId: 'entry-2',
    giveawayId: '3',
    name: 'James Chen',
    email: 'james.chen@email.com',
    country: 'Canada',
    prize: 'AirPods Max + Apple Watch Ultra',
    wonDate: new Date('2025-05-31'),
    status: 'Contacted',
    contactedDate: new Date('2025-06-02'),
  },
]

// Activity Feed
export const SAMPLE_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 'activity-1',
    type: 'EntryReceived',
    title: 'New Entry Received',
    description: 'Michael Johnson entered the iPhone Giveaway',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    giveawayId: '1',
    icon: 'UserPlus',
  },
  {
    id: 'activity-2',
    type: 'EntryReceived',
    title: 'New Entry Received',
    description: 'Rachel Green entered the MacBook Giveaway',
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    giveawayId: '2',
    icon: 'UserPlus',
  },
  {
    id: 'activity-3',
    type: 'GiveawayCreated',
    title: 'Giveaway Created',
    description: 'Summer Giveaway Series has been scheduled',
    timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
    giveawayId: '4',
    icon: 'Gift',
  },
  {
    id: 'activity-4',
    type: 'WinnersDrawn',
    title: 'Winners Drawn',
    description: 'Winners for AirPods Max Giveaway have been announced',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
    giveawayId: '3',
    icon: 'Trophy',
  },
  {
    id: 'activity-5',
    type: 'GiveawayEnded',
    title: 'Giveaway Ended',
    description: 'MacBook Pro Giveaway has closed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
    giveawayId: '2',
    icon: 'XCircle',
  },
]

// Chart Data for Daily Entries
export const SAMPLE_DAILY_ENTRIES: ChartData[] = [
  { date: 'Jun 1', value: 120, entries: 120 },
  { date: 'Jun 2', value: 245, entries: 245 },
  { date: 'Jun 3', value: 189, entries: 189 },
  { date: 'Jun 4', value: 432, entries: 432 },
  { date: 'Jun 5', value: 567, entries: 567 },
  { date: 'Jun 6', value: 623, entries: 623 },
  { date: 'Jun 7', value: 789, entries: 789 },
  { date: 'Jun 8', value: 845, entries: 845 },
  { date: 'Jun 9', value: 912, entries: 912 },
  { date: 'Jun 10', value: 1043, entries: 1043 },
  { date: 'Jun 11', value: 1245, entries: 1245 },
  { date: 'Jun 12', value: 1456, entries: 1456 },
  { date: 'Jun 13', value: 1623, entries: 1623 },
  { date: 'Jun 14', value: 1834, entries: 1834 },
]

// Country Distribution Data
export const SAMPLE_COUNTRY_DATA: CountryData[] = [
  { country: 'United States', entries: 4234, percentage: 35 },
  { country: 'Canada', entries: 1456, percentage: 12 },
  { country: 'United Kingdom', entries: 1200, percentage: 10 },
  { country: 'India', entries: 1089, percentage: 9 },
  { country: 'Australia', entries: 987, percentage: 8 },
  { country: 'Germany', entries: 812, percentage: 7 },
  { country: 'France', entries: 623, percentage: 5 },
  { country: 'Others', entries: 1446, percentage: 14 },
]

// Navigation Menu
export const NAVIGATION_MENU = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', exact: true },
  { href: '/giveaways', label: 'Giveaways', icon: 'Gift' },
  { href: '/entries', label: 'Entries', icon: 'Users' },
  { href: '/winners', label: 'Winners', icon: 'Trophy' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
]

// Status colors
export const STATUS_COLORS = {
  Draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  Scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Live: 'bg-green-500/20 text-green-300 border-green-500/30',
  Closed: 'bg-red-500/20 text-red-300 border-red-500/30',
  Pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Contacted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Claimed: 'bg-green-500/20 text-green-300 border-green-500/30',
  Unclaimed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

// Dashboard Stats (aggregated from sample data)
export const SAMPLE_STATS = {
  totalGiveaways: SAMPLE_GIVEAWAYS.length,
  totalEntries: SAMPLE_ENTRIES.length,
  totalWinners: SAMPLE_WINNERS.length,
  conversionRate: 0.8, // percentage
  activeGiveaways: SAMPLE_GIVEAWAYS.filter(g => g.status === 'Live').length,
}
