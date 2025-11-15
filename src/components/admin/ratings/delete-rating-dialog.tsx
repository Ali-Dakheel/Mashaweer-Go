'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Rating } from '@/lib/schemas'
import { deleteRating } from '@/app/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface DeleteRatingDialogProps {
  rating: Rating
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteRatingDialog({
  rating,
  open,
  onOpenChange,
  onSuccess,
}: DeleteRatingDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteRating(rating.id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete rating')
      }

      toast({
        title: 'Success',
        description: 'Rating deleted successfully',
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Rating</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this rating? This action cannot be undone.
            {rating.comments && (
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                "{rating.comments}"
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
