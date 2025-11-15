import { Suspense } from 'react'
import { AdminDashboardContent } from '@/components/admin-dashboard-content'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-4 md:px-6 py-4 md:py-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

export const metadata = {
  title: 'Dashboard | Admin',
  description: 'Admin dashboard overview',
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  )
}
