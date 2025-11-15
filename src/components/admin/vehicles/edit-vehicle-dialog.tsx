'use client'

import { useRouter } from 'next/navigation'
import { Vehicle } from '@/lib/schemas'
import { updateVehicleAvailability, updateVehiclePrice, updateVehicleDetails, updateVehicleImage } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editVehicleFormSchema, EditVehicleFormData } from '@/lib/schemas'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface EditVehicleDialogProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditVehicleDialog({
  vehicle,
  open,
  onOpenChange,
  onSuccess,
}: EditVehicleDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditVehicleFormData>({
    resolver: zodResolver(editVehicleFormSchema),
    defaultValues: {
      vehicleName: vehicle.vehicle_name || '',
      brand: vehicle.brand || '',
      category: (vehicle.category as any) || 'car',
      description: vehicle.description || '',
      pricePerDay: vehicle.price_per_day?.toString() || '0',
      discountPercent: vehicle.discount_percent?.toString() || '0',
      insurance: vehicle.insurance?.toString() || '0',
      available: vehicle.available ?? true,
      imageUrl: vehicle.image_url || '',
    },
  })

  const availableValue = watch('available')
  const imageUrlValue = watch('imageUrl')
  const categoryValue = watch('category')

  const onSubmit = async (data: EditVehicleFormData) => {
    try {
      // Update availability if changed
      if (data.available !== vehicle.available) {
        const result = await updateVehicleAvailability(vehicle.id, data.available)
        if (!result.success) {
          throw new Error(result.error || 'Failed to update availability')
        }
      }

      // Update pricing if changed
      if (
        parseFloat(data.pricePerDay) !== (vehicle.price_per_day ?? 0) ||
        parseFloat(data.discountPercent) !== (vehicle.discount_percent ?? 0) ||
        parseFloat(data.insurance) !== (vehicle.insurance ?? 0)
      ) {
        const result = await updateVehiclePrice(
          vehicle.id,
          parseFloat(data.pricePerDay),
          parseFloat(data.discountPercent),
          parseFloat(data.insurance)
        )
        if (!result.success) {
          throw new Error(result.error || 'Failed to update pricing')
        }
      }

      // Update details if changed
      if (
        data.vehicleName !== vehicle.vehicle_name ||
        data.brand !== vehicle.brand ||
        data.category !== vehicle.category ||
        data.description !== vehicle.description
      ) {
        const result = await updateVehicleDetails(
          vehicle.id,
          data.vehicleName,
          data.brand,
          data.category,
          data.description
        )
        if (!result.success) {
          throw new Error(result.error || 'Failed to update details')
        }
      }

      // Update image if changed
      if (data.imageUrl !== vehicle.image_url) {
        const result = await updateVehicleImage(
          vehicle.id,
          data.imageUrl || ''
        )
        if (!result.success) {
          throw new Error(result.error || 'Failed to update image')
        }
      }

      toast({
        title: 'Success',
        description: 'Vehicle updated successfully',
      })

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update vehicle details, pricing, and availability
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle-name">Vehicle Name *</Label>
            <Input
              id="vehicle-name"
              placeholder="Toyota Camry 2023"
              {...register('vehicleName')}
            />
            {errors.vehicleName && (
              <p className="text-sm text-red-600">{errors.vehicleName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Input
              id="brand"
              placeholder="Toyota"
              {...register('brand')}
            />
            {errors.brand && (
              <p className="text-sm text-red-600">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryValue} onValueChange={(value) => register('category').onChange({ target: { value } })}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
                <SelectItem value="bikes">Bikes</SelectItem>
                <SelectItem value="marin">Marine</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Vehicle description"
              {...register('description')}
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price-per-day">Price Per Day ($) *</Label>
              <Input
                id="price-per-day"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.99"
                {...register('pricePerDay')}
              />
              {errors.pricePerDay && (
                <p className="text-sm text-red-600">{errors.pricePerDay.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%) *</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0"
                {...register('discountPercent')}
              />
              {errors.discountPercent && (
                <p className="text-sm text-red-600">{errors.discountPercent.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance">Insurance ($) *</Label>
            <Input
              id="insurance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              {...register('insurance')}
            />
            {errors.insurance && (
              <p className="text-sm text-red-600">{errors.insurance.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
            {imageUrlValue && (
              <div className="mt-2 rounded-md border p-2">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <img 
                  src={imageUrlValue} 
                  alt="Vehicle preview" 
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="available"
              checked={availableValue}
              onCheckedChange={(checked) => register('available').onChange({ target: { checked } })}
            />
            <Label htmlFor="available">Available for Rent</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
