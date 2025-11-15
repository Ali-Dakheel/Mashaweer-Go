'use client'

import { useState, useCallback } from 'react'
import { User } from '@/lib/schemas'
import { fetchUsersPage } from '@/app/actions'
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
import { EditUserDialog } from './edit-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
import { CreateUserDialog } from './create-user-dialog'
import { Plus, Loader2 } from 'lucide-react'

interface UsersTableProps {
  initialUsers: User[]
  initialPage: number
  totalPages: number
  total: number
}

export function UsersTable({
  initialUsers,
  initialPage,
  totalPages,
  total,
}: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    agency: 'bg-green-100 text-green-800',
  }

  // Function to refresh the users list from the server
  const refreshUsers = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const result = await fetchUsersPage(initialPage, 25)
      setUsers(result.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh users',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [initialPage, toast])

  const handleUserCreated = useCallback(async () => {
    setIsCreateOpen(false)
    await refreshUsers()
  }, [refreshUsers])

  const handleUserUpdated = useCallback(async () => {
    setEditingUser(null)
    await refreshUsers()
  }, [refreshUsers])

  const handleUserDeleted = useCallback(async (userId: number) => {
    // Optimistic update - remove user from UI immediately
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId))
    setDeletingUser(null)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total users: {total}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshUsers}
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
            Create User
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>CPR</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.cpr}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.Role] || 'bg-gray-100 text-gray-800'}>
                      {user.Role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingUser(user)}
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

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSuccess={handleUserUpdated}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onSuccess={() => handleUserDeleted(deletingUser.id)}
        />
      )}

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleUserCreated}
      />
    </div>
  )
}
