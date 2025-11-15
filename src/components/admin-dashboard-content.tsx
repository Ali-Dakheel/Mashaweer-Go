import { Suspense } from 'react'
import { fetchMetrics } from '@/app/actions'
import { AdminMetricsDisplay } from './admin/metrics-display'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, Building2, Car, Star } from 'lucide-react'

function MetricsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  )
}

export async function AdminDashboardContent() {
  const metricsResult = await fetchMetrics().catch(error => {
    console.error('Error fetching metrics:', error)
    return {
      totalUsers: 0,
      totalAgencies: 0,
      totalVehicles: 0,
      pendingAgencies: 0,
    }
  })

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Manage users, agencies, vehicles, and ratings.
          </p>
        </div>

        {/* Metrics Display */}
        <Suspense fallback={<MetricsSkeleton />}>
          <AdminMetricsDisplay metrics={metricsResult} />
        </Suspense>

        {/* Quick Access Links */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <Link href="/users">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span>Users</span>
              <span className="text-xs text-muted-foreground">{metricsResult.totalUsers} total</span>
            </Button>
          </Link>
          <Link href="/agencies">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Building2 className="h-6 w-6" />
              <span>Agencies</span>
              <span className="text-xs text-muted-foreground">{metricsResult.totalAgencies} total</span>
            </Button>
          </Link>
          <Link href="/vehicles">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Car className="h-6 w-6" />
              <span>Vehicles</span>
              <span className="text-xs text-muted-foreground">{metricsResult.totalVehicles} total</span>
            </Button>
          </Link>
          <Link href="/ratings">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Star className="h-6 w-6" />
              <span>Ratings</span>
              <span className="text-xs text-muted-foreground">Manage reviews</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
