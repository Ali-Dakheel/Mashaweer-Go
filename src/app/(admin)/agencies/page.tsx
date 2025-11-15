import { Suspense } from 'react'
import { fetchAgenciesPage } from '@/app/actions'
import { AgenciesTableContainer } from '@/components/admin/agencies/agencies-table-container'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

function TableSkeleton() {
  return (
    <div className="space-y-4 px-4 md:px-6 py-4 md:py-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export const metadata = {
  title: 'Agencies | Admin Dashboard',
  description: 'Manage rental agencies',
}

export default async function AgenciesPage() {
  const agenciesData = await fetchAgenciesPage(1, 25).catch(error => {
    console.error('Error fetching agencies:', error)
    return { data: [] as never[], total: 0, page: 1, pageSize: 25, totalPages: 0 }
  })

  return (
    <>
      <div className="flex flex-col gap-4 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Agencies</h1>
          <p className="text-muted-foreground">
            Manage rental agencies and approve pending applications
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Use the Status column to approve or reject pending agencies
          </AlertDescription>
        </Alert>

        <Suspense fallback={<TableSkeleton />}>
          <AgenciesTableContainer initialData={agenciesData} />
        </Suspense>
      </div>
    </>
  )
}
