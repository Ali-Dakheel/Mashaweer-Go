'use client'

interface StatusBadgeProps {
  status: string | boolean | null | undefined
  type: 'status' | 'availability' | 'role'
}

const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const getStatusStyles = (
    value: string | boolean | null | undefined,
    badgeType: 'status' | 'availability' | 'role'
  ): { bg: string; text: string; label: string } => {
    if (badgeType === 'availability') {
      return value === true
        ? { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' }
        : { bg: 'bg-red-100', text: 'text-red-800', label: 'Unavailable' }
    }

    if (badgeType === 'status') {
      if (value === 'pending')
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' }
      if (value === 'active')
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' }
      if (value === 'inactive')
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' }
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: String(value) }
    }

    if (badgeType === 'role') {
      return value === 'Admin'
        ? { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Admin' }
        : { bg: 'bg-gray-100', text: 'text-gray-800', label: 'User' }
    }

    return { bg: 'bg-gray-100', text: 'text-gray-800', label: String(value) }
  }

  const { bg, text, label } = getStatusStyles(status, type)

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

export default StatusBadge