'use client'

import { useRouter } from 'next/navigation'
import { createVehicle } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createVehicleFormSchema, CreateVehicleFormData } from '@/lib/schemas'
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

interface CreateVehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateVehicleDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateVehicleDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateVehicleFormData>({
    resolver: zodResolver(createVehicleFormSchema),
    defaultValues: {
      vehicleName: '',
      brand: '',
      category: 'car',
      pricePerDay: '',
      description: '',
      imageUrl: '',
      discountPercent: '0',
      insurance: '50',
    },
  })

  const categoryValue = watch('category')
  const imageUrlValue = watch('imageUrl')

  const onSubmit = async (data: CreateVehicleFormData) => {
    try {
      const result = await createVehicle(
        data.vehicleName,
        data.brand,
        data.category,
        parseFloat(data.pricePerDay),
        undefined,
        data.description,
        data.imageUrl,
        data.discountPercent ? parseFloat(data.discountPercent) : undefined,
        data.insurance ? parseFloat(data.insurance) : undefined
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to create vehicle')
      }

      toast({
        title: 'Success',
        description: 'Vehicle created successfully',
      })

      reset()
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
          <DialogTitle>Create New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new rental vehicle to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleName">Vehicle Name *</Label>
            <Input
              id="vehicleName"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price Per Day ($) *</Label>
              <Input
                id="pricePerDay"
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
              <Label htmlFor="discountPercent">Discount (%)</Label>
              <Input
                id="discountPercent"
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
            <Label htmlFor="insurance">Insurance ($)</Label>
            <Input
              id="insurance"
              type="number"
              step="0.01"
              min="0"
              placeholder="50"
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional vehicle description"
              {...register('description')}
              className="min-h-[80px]"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
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
              Create Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
