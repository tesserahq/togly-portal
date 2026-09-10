import { useState } from 'react'
import { Button } from '@/modules/shadcn/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/modules/shadcn/ui/dialog'
import { Eye } from 'lucide-react'

interface Props {
  snapshot: Record<string, unknown> | null
}

export function AuditLogSnapshotCell({ snapshot }: Props) {
  const [open, setOpen] = useState(false)

  if (!snapshot) {
    return <span className="text-sm text-muted-foreground">-</span>
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4" />
        View
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Snapshot</DialogTitle>
          </DialogHeader>
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs">
            {JSON.stringify(snapshot, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  )
}
