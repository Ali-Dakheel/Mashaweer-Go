import { Suspense } from 'react'
import { fetchVehiclesPage } from '@/app/actions'
import { VehiclesTableContainer } from '@/components/admin/vehicles/vehicles-table-container'
import { Skeleton } from '@/components/ui/skeleton'

function TableSkeleton() {
  return (
    <div className="space-y-4 px-4 md:px-6 py-4 md:py-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export const metadata = {
  title: 'Vehicles | Admin Dashboard',
  description: 'Manage rental vehicles',
}

export default async function VehiclesPage() {
  const vehiclesData = await fetchVehiclesPage(1, 25).catch(error => {
    console.error('Error fetching vehicles:', error)
    return { data: [] as never[], total: 0, page: 1, pageSize: 25, totalPages: 0 }
  })

  return (
    <>
      <div className="flex flex-col gap-4 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage rental vehicles, pricing, and availability
          </p>
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <VehiclesTableContainer initialData={vehiclesData} />
        </Suspense>
      </div>
    </>
  )
}
