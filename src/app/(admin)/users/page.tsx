import { Suspense } from 'react'
import { fetchUsersPage } from '@/app/actions'
import { UsersTableContainer } from '@/components/admin/users/users-table-container'
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
  title: 'Users | Admin Dashboard',
  description: 'Manage system users',
}

export default async function UsersPage() {
  const usersData = await fetchUsersPage(1, 25).catch(error => {
    console.error('Error fetching users:', error)
    return { data: [] as never[], total: 0, page: 1, pageSize: 25, totalPages: 0 }
  })

  return (
    <>
      <div className="flex flex-col gap-4 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <UsersTableContainer initialData={usersData} />
        </Suspense>
      </div>
    </>
  )
}
