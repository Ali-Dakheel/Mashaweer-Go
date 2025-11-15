'use client'

import { useState, useCallback } from 'react'
import { Rating } from '@/lib/schemas'
import { fetchRatingsPage } from '@/app/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { DeleteRatingDialog } from './delete-rating-dialog'
import { CreateRatingDialog } from './create-rating-dialog'
import { Star, MessageSquare, Plus, Loader2 } from 'lucide-react'

interface RatingsTableProps {
  initialRatings: Rating[]
  initialPage: number
  totalPages: number
  total: number
}

export function RatingsTable({
  initialRatings,
  initialPage,
  totalPages,
  total,
}: RatingsTableProps) {
  const [ratings, setRatings] = useState<Rating[]>(initialRatings)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const [deletingRating, setDeletingRating] = useState<Rating | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const refreshRatings = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const result = await fetchRatingsPage(initialPage, 25)
      setRatings(result.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh ratings',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [initialPage, toast])

  const handleRatingCreated = useCallback(async () => {
    setIsCreateOpen(false)
    await refreshRatings()
  }, [refreshRatings])

  const handleRatingDeleted = useCallback(async (ratingId: number) => {
    setRatings(prevRatings => prevRatings.filter(r => r.id !== ratingId))
    setDeletingRating(null)
  }, [])

  function renderStars(rating: number | null | undefined) {
    if (!rating) return <span className="text-muted-foreground">No rating</span>

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total ratings: {total}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshRatings}
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
            Create Rating
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No ratings found
                </TableCell>
              </TableRow>
            ) : (
              ratings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell>{renderStars(rating.ratings)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {rating.comments ? (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                        <span className="truncate">{rating.comments}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No comments</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {rating.user_name || <span className="text-muted-foreground">Unknown User (ID: {rating.user_id})</span>}
                  </TableCell>
                  <TableCell className="font-medium">
                    {rating.vehicle_name ? (
                      <span>{rating.vehicle_name}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {rating.vehicle_id ? rating.vehicle_id.substring(0, 8) + '...' : 'Unknown Vehicle'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {rating.created_at
                      ? new Date(rating.created_at).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingRating(rating)}
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

      {deletingRating && (
        <DeleteRatingDialog
          rating={deletingRating}
          open={!!deletingRating}
          onOpenChange={(open) => !open && setDeletingRating(null)}
          onSuccess={() => handleRatingDeleted(deletingRating.id)}
        />
      )}

      <CreateRatingDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRatingCreated}
      />
    </div>
  )
}
