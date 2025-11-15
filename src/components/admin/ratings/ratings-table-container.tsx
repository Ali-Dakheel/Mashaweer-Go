import { Rating } from '@/lib/schemas'
import { RatingsTable } from './ratings-table'

interface RatingsTableContainerProps {
  initialData: {
    data: Rating[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export async function RatingsTableContainer({ initialData }: RatingsTableContainerProps) {
  return (
    <RatingsTable
      initialRatings={initialData.data}
      initialPage={initialData.page}
      totalPages={initialData.totalPages}
      total={initialData.total}
    />
  )
}
