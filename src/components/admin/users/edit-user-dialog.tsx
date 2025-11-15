'use client'

import { useRouter } from 'next/navigation'
import { User } from '@/lib/schemas'
import { updateUserRole, updateUserContact } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editUserFormSchema, EditUserFormData } from '@/lib/schemas'
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

interface EditUserDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditUserDialogProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      email: user.email,
      phoneNumber: user.phone_number,
      cpr: user.cpr,
      role: user.Role as 'admin' | 'user' | 'agency',
    },
  })

  const roleValue = watch('role')

  const onSubmit = async (data: EditUserFormData) => {
    try {
      // Update role if changed
      if (data.role !== user.Role) {
        const result = await updateUserRole(user.id, data.role)
        if (!result.success) {
          throw new Error(result.error || 'Failed to update role')
        }
      }

      // Update contact info if changed
      if (data.email !== user.email || data.phoneNumber !== user.phone_number) {
        const result = await updateUserContact(user.id, data.email, data.phoneNumber)
        if (!result.success) {
          throw new Error(result.error || 'Failed to update contact')
        }
      }

      toast({
        title: 'Success',
        description: 'User updated successfully',
      })

      onOpenChange(false)
      // Call onSuccess which will refresh the data
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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and role
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user.name}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpr">CPR *</Label>
            <Input
              id="cpr"
              placeholder="123456789"
              {...register('cpr')}
            />
            {errors.cpr && (
              <p className="text-sm text-red-600">{errors.cpr.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 8900"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={roleValue} onValueChange={(value) => register('role').onChange({ target: { value } })}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
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
