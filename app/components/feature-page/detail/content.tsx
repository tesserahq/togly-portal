import { DetailContent } from '@/components/detail-content'
import { AppPreloader } from '@/components/loader/pre-loader'
import { DateTime, EmptyContent, ResourceID } from 'tessera-ui'
import { IQueryConfig } from '@/resources/types'
import { useFeatureAuditLog, useGetFeature } from '@/resources/features'
import { FeatureGateManagement } from './gate-management'
import { DataTable } from '@/components/data-table'
import { auditLogColumns } from '@/components/audit-log-page/audit.columns'

interface FeatureDetailContentProps {
  config: IQueryConfig
  featureKey: string
}

export function FeatureDetailContent({ config, featureKey }: FeatureDetailContentProps) {
  const { data, isLoading, error } = useGetFeature(config, featureKey)
  const {
    data: logs,
    isLoading: isLoadingLog,
    error: isLogError,
  } = useFeatureAuditLog(config, data?.id ?? '', {
    enabled: !!data?.id,
  })

  if (isLoading || isLoadingLog) {
    return <AppPreloader className="min-h-screen" />
  }

  if (data === undefined || error || isLogError) {
    return (
      <EmptyContent
        title="Oops, looks like we're failed to fetch feature detail"
        description={error?.message}
        image="/images/empty-data.png"
      />
    )
  }

  return (
    <div className="grid grid-flow-row">
      <DetailContent
        title="Feature Detail"
        className="grid grid-cols-9 grid-rows-[max-content_max-content] gap-y-20 h-fit">
        <div className="d-list col-span-7 col-start-2 row-start-1">
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">ID:</dt>
            <dd className="d-content">
              <ResourceID value={data.id} />
            </dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Key:</dt>
            <dd className="d-content">{data?.key || 'N/A'}</dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Description:</dt>
            <dd className="d-content">{data?.description || 'N/A'}</dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Created:</dt>
            <dd className="d-content">
              <DateTime date={data.created_at} formatStr="dd/MM/yyyy HH:mm:ss" />
            </dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Updated:</dt>
            <dd className="d-content">
              <DateTime date={data.updated_at} formatStr="dd/MM/yyyy HH:mm:ss" />
            </dd>
          </div>
          <div className="d-item border-none items-start!">
            <dt className="d-label text-end pr-5">Gates:</dt>
            <dd className="d-content w-full overflow-visible!">
              <FeatureGateManagement config={config} feature={data} />
            </dd>
          </div>
        </div>
      </DetailContent>
      <DetailContent title="Logs">
        {logs && logs?.length === 0 ? (
          <EmptyContent
            title="No audit history"
            description="No actions have been recorded for this feature yet."
            image="/images/empty-data.png"
          />
        ) : (
          <DataTable columns={auditLogColumns} data={logs ?? []} />
        )}
      </DetailContent>
    </div>
  )
}
