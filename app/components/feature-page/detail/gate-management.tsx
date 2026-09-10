import { useEffect, useRef, useState } from 'react'
import { Button } from '@/modules/shadcn/ui/button'
import { Badge } from '@/modules/shadcn/ui/badge'
import { Input } from '@/modules/shadcn/ui/input'
import { Globe, Loader2, Plus, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/data-table'
import {
  IFeature,
  useDisableActorGate,
  useDisableBooleanGate,
  useEnableActorGate,
  useEnableBooleanGate,
} from '@/resources/features'
import { IQueryConfig } from '@/resources/types'

import DeleteConfirmation, {
  DeleteConfirmationHandle,
} from '@/components/delete-confirmation/delete-confirmation'
import { cn } from '@/modules/shadcn/lib/utils'
import { actorGateColumns } from './gate-actor.columns'

interface FeatureGateManagementProps {
  config: IQueryConfig
  feature: IFeature
}

export function FeatureGateManagement({ config, feature }: FeatureGateManagementProps) {
  const { key, gates } = feature
  const globalGate = gates.find((g) => g.gate_type === 'boolean')
  const actorGates = gates.filter((g) => g.gate_type === 'actor')

  const confirmRef = useRef<DeleteConfirmationHandle>(null)
  const [newActorId, setNewActorId] = useState('')

  const { mutate: enableBoolean, isPending: isEnabling } = useEnableBooleanGate(config)
  const { mutate: disableBoolean, isPending: isDisabling } = useDisableBooleanGate(config, {
    onSuccess: () => confirmRef.current?.close(),
  })
  const { mutate: enableActor, isPending: isAddingActor } = useEnableActorGate(config, {
    onSuccess: () => setNewActorId(''),
  })
  const { mutate: disableActor, isPending: isRemovingActor } = useDisableActorGate(config, {
    onSuccess: () => confirmRef.current?.close(),
  })

  useEffect(() => {
    confirmRef.current?.updateConfig({ isLoading: isDisabling || isRemovingActor })
  }, [isDisabling, isRemovingActor])

  const sanitizeActorInput = (value: string) => value.replace(/[^a-zA-Z0-9._]/g, '')

  const handleAddActor = () => {
    const actorId = newActorId.trim()
    if (!actorId) return

    const alreadyExists = actorGates.some((gate) => gate.value === actorId)
    if (alreadyExists) {
      toast.error('Actor gate already exists', {
        description: `Actor "${actorId}" is already gated for this feature.`,
      })
      return
    }

    enableActor({ key, actorId })
  }

  const openDisableGlobalConfirm = () => {
    confirmRef.current?.open({
      title: 'Disable global gate?',
      description: `This turns "${key}" disable globally, please be certain`,
      onDelete: () => disableBoolean({ key }),
      isLoading: isDisabling,
    })
  }

  const openRemoveActorConfirm = (actorId: string) => {
    confirmRef.current?.open({
      title: 'Remove actor gate?',
      description: `This removes "${actorId}" from the list.`,
      onDelete: () => disableActor({ key, actorId }),
      isLoading: isRemovingActor,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'mt-0.5 flex h-9 w-9 items-center justify-center rounded-full',
                globalGate ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              )}>
              <Globe className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Global Gate</p>

                <Badge variant={globalGate ? 'default' : 'secondary'} className="text-xs">
                  {globalGate ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {globalGate
                  ? 'This feature is currently enabled globally.'
                  : 'This feature is not enabled globally.'}
              </p>
            </div>
          </div>

          {globalGate ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isDisabling}
              onClick={openDisableGlobalConfirm}>
              {isDisabling ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disable'}
            </Button>
          ) : (
            <Button size="sm" disabled={isEnabling} onClick={() => enableBoolean({ key })}>
              {isEnabling ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enable'}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-muted
                text-muted-foreground">
              <UserRound className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Actor Gates</p>

                <Badge variant="secondary" className="text-xs">
                  {actorGates.length}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Enable this feature for specific actors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Actor ID"
              value={newActorId}
              onChange={(e) => setNewActorId(sanitizeActorInput(e.target.value))}
              className="h-8 w-48"
              disabled={isAddingActor}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddActor()
              }}
            />

            <Button
              size="sm"
              disabled={isAddingActor || !newActorId.trim()}
              onClick={handleAddActor}>
              {isAddingActor ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-4">
          {actorGates.length > 0 ? (
            <DataTable
              fixed={false}
              columns={actorGateColumns({
                onRemove: openRemoveActorConfirm,
                isRemoving: isRemovingActor,
              })}
              data={actorGates}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-md border border-dashed
                py-10 text-center">
              <UserRound className="mb-3 h-5 w-5 text-muted-foreground" />

              <p className="text-sm font-medium">No actor gates</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add an actor ID above to enable this feature for a specific actor.
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmation ref={confirmRef} />
    </div>
  )
}
