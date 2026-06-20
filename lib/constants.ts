import type { ActivityFeedItem, ChartData } from './types'

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

