import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/modules/shadcn/ui/button'
import { X } from 'lucide-react'
import { IGate } from '@/resources/features'

interface ActorGateColumnsOptions {
  onRemove: (actorId: string) => void
  isRemoving?: boolean
}

export function actorGateColumns({
  onRemove,
  isRemoving,
}: ActorGateColumnsOptions): ColumnDef<IGate>[] {
  return [
    {
      accessorKey: 'value',
      header: 'Actor ID',
      size: 300,
      cell: ({ row }) => {
        const { value } = row.original
        return (
          <div className="max-w-[400px] truncate" title={value}>
            {value}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => {
        const { value } = row.original
        return (
          <div className="flex flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              disabled={isRemoving}
              onClick={() => onRemove(value)}
              aria-label={`Remove actor ${value}`}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
