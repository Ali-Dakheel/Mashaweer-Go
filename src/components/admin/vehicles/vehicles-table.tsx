'use client'

import { useState, useCallback } from 'react'
import { Vehicle } from '@/lib/schemas'
import { fetchVehiclesPage } from '@/app/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { EditVehicleDialog } from './edit-vehicle-dialog'
import { DeleteVehicleDialog } from './delete-vehicle-dialog'
import { CreateVehicleDialog } from './create-vehicle-dialog'
import { Star, Check, X, Plus, Loader2, ImageIcon } from 'lucide-react'

interface VehiclesTableProps {
  initialVehicles: Vehicle[]
  initialPage: number
  totalPages: number
  total: number
}

export function VehiclesTable({
  initialVehicles,
  initialPage,
  totalPages,
  total,
}: VehiclesTableProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const categoryColors: Record<string, string> = {
    car: 'bg-blue-100 text-blue-800',
    bus: 'bg-green-100 text-green-800',
    motorcycle: 'bg-red-100 text-red-800',
    scooter: 'bg-yellow-100 text-yellow-800',
    bikes: 'bg-purple-100 text-purple-800',
    marin: 'bg-cyan-100 text-cyan-800',
  }

  const refreshVehicles = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const result = await fetchVehiclesPage(initialPage, 25)
      setVehicles(result.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh vehicles',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [initialPage, toast])

  const handleVehicleCreated = useCallback(async () => {
    setIsCreateOpen(false)
    await refreshVehicles()
  }, [refreshVehicles])

  const handleVehicleUpdated = useCallback(async () => {
    setEditingVehicle(null)
    await refreshVehicles()
  }, [refreshVehicles])

  const handleVehicleDeleted = useCallback(async (vehicleId: string) => {
    setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleId))
    setDeletingVehicle(null)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total vehicles: {total}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshVehicles}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Vehicle
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Vehicle Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No vehicles found
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    {vehicle.image_url ? (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-50">
                        <img 
                          src={vehicle.image_url} 
                          alt={vehicle.vehicle_name || 'Vehicle'} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.vehicle_name || '-'}</TableCell>
                  <TableCell>{vehicle.brand || '-'}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[vehicle.category] || 'bg-gray-100 text-gray-800'}>
                      {vehicle.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${vehicle.price_per_day?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>
                    {vehicle.available ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{vehicle.rating_avg?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingVehicle(vehicle)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingVehicle && (
        <EditVehicleDialog
          vehicle={editingVehicle}
          open={!!editingVehicle}
          onOpenChange={(open) => !open && setEditingVehicle(null)}
          onSuccess={handleVehicleUpdated}
        />
      )}

      {deletingVehicle && (
        <DeleteVehicleDialog
          vehicle={deletingVehicle}
          open={!!deletingVehicle}
          onOpenChange={(open) => !open && setDeletingVehicle(null)}
          onSuccess={() => handleVehicleDeleted(deletingVehicle.id)}
        />
      )}

      <CreateVehicleDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleVehicleCreated}
      />
    </div>
  )
}
