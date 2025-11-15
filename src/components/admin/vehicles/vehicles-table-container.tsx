import { Vehicle } from '@/lib/schemas'
import { VehiclesTable } from './vehicles-table'

interface VehiclesTableContainerProps {
  initialData: {
    data: Vehicle[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export async function VehiclesTableContainer({ initialData }: VehiclesTableContainerProps) {
  return (
    <VehiclesTable
      initialVehicles={initialData.data}
      initialPage={initialData.page}
      totalPages={initialData.totalPages}
      total={initialData.total}
    />
  )
}
