'use client'

import { useRouter } from 'next/navigation'
import { createAgency } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAgencyFormSchema, CreateAgencyFormData } from '@/lib/schemas'
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
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface CreateAgencyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateAgencyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAgencyDialogProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAgencyFormData>({
    resolver: zodResolver(createAgencyFormSchema),
    defaultValues: {
      agencyName: '',
      crNumber: '',
      location: '',
      contact: '',
    },
  })

  const onSubmit = async (data: CreateAgencyFormData) => {
    try {
      const result = await createAgency(
        data.agencyName,
        data.crNumber,
        data.location,
        data.contact
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to create agency')
      }

      toast({
        title: 'Success',
        description: 'Agency created successfully (Pending Review)',
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
          <DialogTitle>Create New Agency</DialogTitle>
          <DialogDescription>
            Add a new rental agency (will be pending review)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agencyName">Agency Name *</Label>
            <Input
              id="agencyName"
              placeholder="Your Agency Name"
              {...register('agencyName')}
            />
            {errors.agencyName && (
              <p className="text-sm text-red-600">{errors.agencyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="crNumber">CR Number *</Label>
            <Input
              id="crNumber"
              placeholder="12345"
              {...register('crNumber')}
            />
            {errors.crNumber && (
              <p className="text-sm text-red-600">{errors.crNumber.message}</p>
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
            <Label htmlFor="contact">Contact Info *</Label>
            <Input
              id="contact"
              placeholder="+1 234 567 8900"
              {...register('contact')}
            />
            {errors.contact && (
              <p className="text-sm text-red-600">{errors.contact.message}</p>
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
              Create Agency
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
