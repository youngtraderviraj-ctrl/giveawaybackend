import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * Locale-independent date formatter (e.g. "19 Jun 2026").
 * Uses UTC parts so the server and client always produce identical output,
 * which avoids React hydration mismatches in client components.
 */
export function formatDate(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${day} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
