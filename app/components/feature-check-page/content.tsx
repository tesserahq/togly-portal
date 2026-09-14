import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IQueryConfig, QueryError } from '@/resources/types'
import { Alert, AlertDescription, AlertTitle } from '@/modules/shadcn/ui/alert'
import { useFeatures } from '@/resources/features'
import {
  featureCheckFormSchema,
  IEnabledFeatures,
  TFeatureCheckFormInput,
  useCheckFeature,
  useListEnabledFeatures,
} from '@/resources/feature-check'
import { AppPreloader } from '../loader/pre-loader'
import { DateTime, EmptyContent } from 'tessera-ui'
import { DetailContent } from '../detail-content'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shadcn/ui/select'
import { Input } from '@/modules/shadcn/ui/input'
import { Button } from '@/modules/shadcn/ui/button'
import { Badge } from '@/modules/shadcn/ui/badge'
import { DataTable } from '../data-table'
import { ColumnDef } from '@tanstack/react-table'

interface FeatureCheckContentProps {
  config: IQueryConfig
}

interface ICheckResult {
  key: string
  enabled: boolean
  actorId: string | null
  checkedAt: string
}

interface IEnabledFeaturesResult {
  features: string[]
  actorId: string | null
}

const ERROR_TITLES: Record<string, string> = {
  UNAUTHORIZED: 'Not authenticated (401)',
  FORBIDDEN: 'Not authorized (403)',
  BAD_REQUEST: 'Invalid request',
  VALIDATION_ERROR: 'Invalid request',
  SERVER_ERROR: 'Server error',
  NETWORK_ERROR: 'Network error',
}

function FeatureCheckErrorAlert({ error }: { error: QueryError }) {
  const title = (error.code && ERROR_TITLES[error.code]) || 'Check failed'
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}

interface IEnabledFeatureRow {
  key: string
}

const enabledFeatureColumns: ColumnDef<IEnabledFeatureRow>[] = [
  {
    accessorKey: 'key',
    header: 'Feature Key',
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.key}</span>,
  },
]

export function FeatureCheckContent({ config }: FeatureCheckContentProps) {
  // Backs the feature selector — same list FeatureDetailContent draws from.
  const {
    data: featuresPage,
    isLoading: isLoadingFeatures,
    error: featuresError,
  } = useFeatures(
    config,
    { page: 1, size: 100 },
    {
      enabled: !!config.token,
    }
  )
  const features = featuresPage?.items ?? []

  const [result, setResult] = useState<ICheckResult | null>(null)
  const [checkError, setCheckError] = useState<QueryError | null>(null)
  // useCheckFeature's onSuccess only receives the raw { key, enabled }
  // response, so the actor ID being tested is captured here at submit time
  // rather than threaded back through the mutation.
  const pendingCheckActorIdRef = useRef<string | null>(null)

  const [enabledResult, setEnabledResult] = useState<IEnabledFeaturesResult | null>(null)
  const [enabledError, setEnabledError] = useState<QueryError | null>(null)
  const [enabledActorInput, setEnabledActorInput] = useState('')
  const pendingEnabledActorIdRef = useRef<string | null>(null)

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<TFeatureCheckFormInput>({
    resolver: zodResolver(featureCheckFormSchema),
    defaultValues: { key: '', actor_id: '' },
  })

  const selectedKey = watch('key')

  const checkMutation = useCheckFeature(config, {
    onSuccess: (data) => {
      setResult({
        key: data.key,
        enabled: data.enabled,
        actorId: pendingCheckActorIdRef.current,
        checkedAt: new Date().toISOString(),
      })
      setCheckError(null)
    },
    onError: (error) => {
      setResult(null)
      setCheckError(error)
    },
  })

  const enabledFeaturesMutation = useListEnabledFeatures(config, {
    onSuccess: (data) => {
      setEnabledResult({
        features: data.features,
        actorId: pendingEnabledActorIdRef.current,
      })
      setEnabledError(null)
    },
    onError: (error) => {
      setEnabledResult(null)
      setEnabledError(error)
    },
  })

  // Actor IDs live only in this component's state/refs — never written to
  // the URL, localStorage/sessionStorage, or any logging/analytics call.
  const onSubmit = (values: TFeatureCheckFormInput) => {
    if (checkMutation.isPending) return
    const actorId = values.actor_id?.trim() || null
    pendingCheckActorIdRef.current = actorId
    checkMutation.mutate({ key: values.key, actorId })
  }

  const handleListEnabled = () => {
    if (enabledFeaturesMutation.isPending) return
    const actorId = enabledActorInput.trim() || null
    pendingEnabledActorIdRef.current = actorId
    enabledFeaturesMutation.mutate({ actorId })
  }

  if (isLoadingFeatures) {
    return <AppPreloader className="min-h-screen" />
  }

  if (featuresPage === undefined || featuresError) {
    return (
      <EmptyContent
        title="Oops, looks like we're failed to fetch features"
        description={featuresError?.message}
        image="/images/empty-data.png"
      />
    )
  }

  return (
    <div className="grid grid-flow-row">
      <DetailContent title="Test a feature">
        <div className="grid grid-flow-col items-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg" autoComplete="off">
            <div className="space-y-1">
              <label className="text-sm font-medium">Feature</label>
              <Select
                value={selectedKey}
                onValueChange={(value) => setValue('key', value, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a feature" />
                </SelectTrigger>
                <SelectContent>
                  {features.map((feature) => (
                    <SelectItem key={feature.key} value={feature.key}>
                      {feature.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.key && <p className="text-sm text-destructive">{errors.key.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Actor ID (optional)</label>
              <Input
                {...register('actor_id')}
                placeholder="Leave blank to test the global gate"
                autoComplete="off"
              />
              <p className="text-xs text-neutrals-500">
                Omitting the actor ID tests only the global boolean gate.
              </p>
            </div>

            <Button type="submit" disabled={checkMutation.isPending}>
              {checkMutation.isPending ? 'Checking…' : 'Check feature'}
            </Button>
          </form>

          <div className="space-y-4 max-w-lg">
            {checkError && <FeatureCheckErrorAlert error={checkError} />}

            {result && (
              <div className="rounded-lg border p-4 space-y-2 max-w-lg">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{result.key}</span>
                  <Badge variant={result.enabled ? 'default' : 'secondary'}>
                    {result.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="text-sm text-neutrals-500">
                  {result.actorId ? `Actor: ${result.actorId}` : 'Global check'}
                </div>
                <div className="text-xs text-neutrals-400">
                  Checked at <DateTime date={result.checkedAt} formatStr="dd/MM/yyyy HH:mm:ss" />
                </div>
              </div>
            )}
          </div>
        </div>
      </DetailContent>

      <DetailContent title="Enabled features for an actor">
        <form className="space-y-4 max-w-lg" autoComplete="off">
          <div className="flex gap-2 max-w-lg">
            <Input
              value={enabledActorInput}
              onChange={(event) => setEnabledActorInput(event.target.value)}
              placeholder="Leave blank to list globally enabled features"
              autoComplete="off"
            />
            <Button
              type="button"
              disabled={enabledFeaturesMutation.isPending}
              onClick={handleListEnabled}>
              {enabledFeaturesMutation.isPending ? 'Loading…' : 'Fetch'}
            </Button>
          </div>
        </form>

        {enabledError && <FeatureCheckErrorAlert error={enabledError} />}

        {enabledResult &&
          (enabledResult.features.length === 0 ? (
            <EmptyContent
              title="No enabled features"
              description={
                enabledResult.actorId
                  ? `No features are enabled for actor ${enabledResult.actorId}.`
                  : 'No features are enabled globally.'
              }
              image="/images/empty-data.png"
            />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center my-4">
                <span className="font-mono text-sm">Config:</span>
                <Badge>{enabledResult.actorId ? `Actor ${enabledResult.actorId}` : 'Global'}</Badge>
              </div>
              <DataTable
                fixed={false}
                columns={enabledFeatureColumns}
                data={enabledResult.features.map((key) => ({ key }))}
              />
            </div>
          ))}
      </DetailContent>
    </div>
  )
}
