import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '—'
  return num.toString()
}

export function truncateText(text: string | null | undefined, length: number = 50): string {
  if (!text) return '—'
  return text.length > length ? `${text.substring(0, length)}...` : text
}

export function getStatusColor(status: string | null | undefined): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'active':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'inactive':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export function getAvailabilityColor(isAvailable: boolean | null | undefined): string {
  if (isAvailable === true) {
    return 'bg-green-50 text-green-700 border-green-200'
  }
  return 'bg-red-50 text-red-700 border-red-200'
}

export function getRoleColor(role: string | null | undefined): string {
  if (role === 'Admin') {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  return 'bg-gray-50 text-gray-700 border-gray-200'
}
