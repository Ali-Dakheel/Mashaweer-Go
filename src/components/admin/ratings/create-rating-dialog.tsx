'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createRating, fetchUsersForDropdown, fetchVehiclesForDropdown } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createRatingFormSchema, CreateRatingFormData } from '@/lib/schemas'
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

interface CreateRatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateRatingDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateRatingDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<Array<{ id: number; name: string }>>([])
  const [vehicles, setVehicles] = useState<Array<{ id: string; vehicle_name: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateRatingFormData>({
    resolver: zodResolver(createRatingFormSchema),
    defaultValues: {
      vehicleId: '',
      rating: '5',
      comments: '',
      userId: '',
    },
  })

  const ratingValue = watch('rating')
  const vehicleIdValue = watch('vehicleId')
  const userIdValue = watch('userId')

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        setIsLoading(true)
        try {
          const [usersRes, vehiclesRes] = await Promise.all([
            fetchUsersForDropdown(),
            fetchVehiclesForDropdown(),
          ])
          if (usersRes.success) setUsers(usersRes.data)
          if (vehiclesRes.success) setVehicles(vehiclesRes.data)
        } catch (error) {
          console.error('Failed to load dropdown data:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadData()
    }
  }, [open])

  const onSubmit = async (data: CreateRatingFormData) => {
    try {
      const result = await createRating(
        data.vehicleId,
        parseInt(data.rating),
        data.comments || '',
        parseInt(data.userId)
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to create rating')
      }

      toast({
        title: 'Success',
        description: 'Rating created successfully',
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Rating</DialogTitle>
          <DialogDescription>
            Add a new rating or review for a vehicle
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle ID *</Label>
            <Input
              id="vehicleId"
              placeholder="Enter vehicle UUID"
              {...register('vehicleId')}
            />
            {errors.vehicleId && (
              <p className="text-sm text-red-600">{errors.vehicleId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID *</Label>
            <Input
              id="userId"
              type="number"
              placeholder="Enter user ID"
              {...register('userId')}
            />
            {errors.userId && (
              <p className="text-sm text-red-600">{errors.userId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5) *</Label>
            <Select value={ratingValue} onValueChange={(value) => register('rating').onChange({ target: { value } })}>
              <SelectTrigger id="rating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              placeholder="Optional review comments"
              {...register('comments')}
              className="min-h-[80px]"
            />
            {errors.comments && (
              <p className="text-sm text-red-600">{errors.comments.message}</p>
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
              Create Rating
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
