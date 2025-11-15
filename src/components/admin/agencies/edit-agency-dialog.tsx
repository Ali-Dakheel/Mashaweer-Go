'use client'

import { useRouter } from 'next/navigation'
import { Agency } from '@/lib/schemas'
import { updateAgencyStatus, updateAgencyContact } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editAgencyFormSchema, EditAgencyFormData } from '@/lib/schemas'
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

interface EditAgencyDialogProps {
  agency: Agency
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditAgencyDialog({
  agency,
  open,
  onOpenChange,
  onSuccess,
}: EditAgencyDialogProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditAgencyFormData>({
    resolver: zodResolver(editAgencyFormSchema),
    defaultValues: {
      agencyName: agency.agency_name || '',
      location: agency.location || '',
      contact: agency.contact || '',
      status: (agency.status as 'pending' | 'active' | 'inactive') || 'pending',
    },
  })

  const statusValue = watch('status')

  const onSubmit = async (data: EditAgencyFormData) => {
    try {
      // Update status if changed
      if (data.status !== agency.status) {
        const result = await updateAgencyStatus(agency.id, data.status)
        if (!result.success) {
          throw new Error(result.error || 'Failed to update status')
        }
      }

      // Update contact info if changed
      if (
        data.agencyName !== agency.agency_name ||
        data.location !== agency.location ||
        data.contact !== agency.contact
      ) {
        const result = await updateAgencyContact(
          agency.id,
          data.agencyName,
          data.location,
          data.contact
        )
        if (!result.success) {
          throw new Error(result.error || 'Failed to update contact')
        }
      }

      toast({
        title: 'Success',
        description: 'Agency updated successfully',
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Agency</DialogTitle>
          <DialogDescription>
            Update agency details and approval status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agency-name">Agency Name *</Label>
            <Input
              id="agency-name"
              placeholder="Your Agency Name"
              {...register('agencyName')}
            />
            {errors.agencyName && (
              <p className="text-sm text-red-600">{errors.agencyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="City, Country"
              {...register('location')}
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact *</Label>
            <Input
              id="contact"
              placeholder="+1 234 567 8900"
              {...register('contact')}
            />
            {errors.contact && (
              <p className="text-sm text-red-600">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={statusValue} onValueChange={(value) => register('status').onChange({ target: { value } })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
