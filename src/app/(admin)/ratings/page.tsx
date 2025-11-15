import { Suspense } from 'react'
import { fetchRatingsPage } from '@/app/actions'
import { RatingsTableContainer } from '@/components/admin/ratings/ratings-table-container'
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
  title: 'Ratings | Admin Dashboard',
  description: 'Manage vehicle ratings and reviews',
}

export default async function RatingsPage() {
  const ratingsData = await fetchRatingsPage(1, 25).catch(error => {
    console.error('Error fetching ratings:', error)
    return { data: [] as never[], total: 0, page: 1, pageSize: 25, totalPages: 0 }
  })

  return (
    <>
      <div className="flex flex-col gap-4 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ratings</h1>
          <p className="text-muted-foreground">
            Manage vehicle ratings and customer reviews
          </p>
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <RatingsTableContainer initialData={ratingsData} />
        </Suspense>
      </div>
    </>
  )
}
