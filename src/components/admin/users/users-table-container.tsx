import { User } from '@/lib/schemas'
import { UsersTable } from './users-table'

interface UsersTableContainerProps {
  initialData: {
    data: User[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export async function UsersTableContainer({ initialData }: UsersTableContainerProps) {
  return (
    <UsersTable
      initialUsers={initialData.data}
      initialPage={initialData.page}
      totalPages={initialData.totalPages}
      total={initialData.total}
    />
  )
}
