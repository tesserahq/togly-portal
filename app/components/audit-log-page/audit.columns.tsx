import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/modules/shadcn/ui/badge'
import { DateTime, ResourceID } from 'tessera-ui'
import { IAuditLogEntry } from '@/resources/features'
import { AuditLogSnapshotCell } from './audit-snapshot.cell'

export const auditLogColumns: ColumnDef<IAuditLogEntry>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 200,
    cell: ({ row }) => {
      const { id } = row.original
      return <ResourceID value={id} />
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    size: 150,
    cell: ({ row }) => {
      const { action } = row.original
      return (
        <Badge variant="outline">
          <span className="text-xs capitalize">{action}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'feature_id',
    header: 'Feature ID',
    size: 250,
    cell: ({ row }) => {
      const { feature_id } = row.original
      return <ResourceID value={feature_id} />
    },
  },
  {
    accessorKey: 'feature_key',
    header: 'Feature Key',
    size: 200,
    cell: ({ row }) => {
      const { feature_key } = row.original
      return <div className="max-w-[200px] truncate">{feature_key}</div>
    },
  },
  {
    accessorKey: 'user_id',
    header: 'User ID',
    size: 200,
    cell: ({ row }) => {
      const { user_id } = row.original
      return <ResourceID value={user_id} />
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date & Time',
    size: 200,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm:ss" />
    },
  },
  {
    accessorKey: 'snapshot',
    header: 'Snapshot',
    size: 100,
    cell: ({ row }) => <AuditLogSnapshotCell snapshot={row.original.snapshot} />,
  },
]
