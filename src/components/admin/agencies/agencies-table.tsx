'use client'

import { useState, useCallback } from 'react'
import { Agency } from '@/lib/schemas'
import { fetchAgenciesPage } from '@/app/actions'
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
import { EditAgencyDialog } from './edit-agency-dialog'
import { DeleteAgencyDialog } from './delete-agency-dialog'
import { CreateAgencyDialog } from './create-agency-dialog'
import { Star, Plus, Loader2 } from 'lucide-react'

interface AgenciesTableProps {
  initialAgencies: Agency[]
  initialPage: number
  totalPages: number
  total: number
}

export function AgenciesTable({
  initialAgencies,
  initialPage,
  totalPages,
  total,
}: AgenciesTableProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null)
  const [deletingAgency, setDeletingAgency] = useState<Agency | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-red-100 text-red-800',
  }

  const refreshAgencies = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const result = await fetchAgenciesPage(initialPage, 25)
      setAgencies(result.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh agencies',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [initialPage, toast])

  const handleAgencyCreated = useCallback(async () => {
    setIsCreateOpen(false)
    await refreshAgencies()
  }, [refreshAgencies])

  const handleAgencyUpdated = useCallback(async () => {
    setEditingAgency(null)
    await refreshAgencies()
  }, [refreshAgencies])

  const handleAgencyDeleted = useCallback(async (agencyId: string) => {
    setAgencies(prevAgencies => prevAgencies.filter(a => a.id !== agencyId))
    setDeletingAgency(null)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total agencies: {total}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshAgencies}
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
            Create Agency
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agency Name</TableHead>
              <TableHead>CR Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No agencies found
                </TableCell>
              </TableRow>
            ) : (
              agencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell className="font-medium">{agency.agency_name}</TableCell>
                  <TableCell>{agency.cr_number || '-'}</TableCell>
                  <TableCell>{agency.location || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[agency.status || ''] || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {agency.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{agency.rating_avg?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAgency(agency)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingAgency(agency)}
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

      {editingAgency && (
        <EditAgencyDialog
          agency={editingAgency}
          open={!!editingAgency}
          onOpenChange={(open) => !open && setEditingAgency(null)}
          onSuccess={handleAgencyUpdated}
        />
      )}

      {deletingAgency && (
        <DeleteAgencyDialog
          agency={deletingAgency}
          open={!!deletingAgency}
          onOpenChange={(open) => !open && setDeletingAgency(null)}
          onSuccess={() => handleAgencyDeleted(deletingAgency.id)}
        />
      )}

      <CreateAgencyDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleAgencyCreated}
      />
    </div>
  )
}
