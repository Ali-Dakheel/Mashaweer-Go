import { Agency } from '@/lib/schemas'
import { AgenciesTable } from './agencies-table'

interface AgenciesTableContainerProps {
  initialData: {
    data: Agency[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export async function AgenciesTableContainer({ initialData }: AgenciesTableContainerProps) {
  return (
    <AgenciesTable
      initialAgencies={initialData.data}
      initialPage={initialData.page}
      totalPages={initialData.totalPages}
      total={initialData.total}
    />
  )
}
