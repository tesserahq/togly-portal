import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/modules/shadcn/ui/badge'
import { DateTime, ResourceID } from 'tessera-ui'
import { Link } from 'react-router'
import { IFeature } from '@/resources/features'

export const columns: ColumnDef<IFeature>[] = [
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
    accessorKey: 'status',
    header: 'Status',
    size: 10,
    cell: ({ row }) => {
      const { gates } = row.original
      const isEnabled = gates.length > 0

      return (
        <Badge
          variant={isEnabled ? 'default' : 'secondary'}
          className={
            isEnabled ? 'bg-[#85D544] dark:bg-[#508029]' : 'bg-neutrals-500 dark:bg-neutrals-600'
          }>
          <span className="text-xs capitalize">{isEnabled ? 'enabled' : 'disabled'}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'key',
    header: 'Key',
    size: 250,
    cell: ({ row }) => {
      const { key } = row.original
      return (
        <Link to={`/features/${key}`} className="button-link">
          <div className="max-w-[200px] truncate" title={key}>
            {key}
          </div>
        </Link>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 300,
    cell: ({ row }) => {
      const { description } = row.original
      return <div className="max-w-[400px] truncate">{description || '-'}</div>
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    size: 200,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm:ss" />
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    size: 200,
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string
      return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm:ss" />
    },
  },
]
