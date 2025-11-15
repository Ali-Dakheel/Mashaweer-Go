'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import SearchInput from './SearchInput'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface AdminTableProps {
  title: string
  columns: Column[]
  data: any[]
  isLoading: boolean
  onDelete: (id: string | number) => Promise<void>
  searchFields: string[]
}

const AdminTable = ({
  title,
  columns,
  data,
  isLoading,
  onDelete,
  searchFields,
}: AdminTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  const filteredData = data.filter((row) =>
    searchFields.some((field) =>
      String(row[field] || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  )

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
        <p className="mt-4 text-gray-600 font-medium">Loading {title.toLowerCase()}...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-600 font-medium">
          {filteredData.length} of {data.length} records
        </span>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={`Search ${title.toLowerCase()}...`}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="font-medium">No {title.toLowerCase()} found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left px-6 py-4 font-semibold text-gray-700"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 transition"
                    role="row"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 truncate max-w-xs">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || '-')}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        aria-label={`Delete record ${row.id}`}
                        tabIndex={0}
                      >
                        {deletingId === row.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTable
