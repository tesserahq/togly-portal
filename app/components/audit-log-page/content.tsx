import { useState } from 'react'
import { AppPreloader } from '@/components/loader/pre-loader'
import { DataTable } from '@/components/data-table'
import { Button } from '@/modules/shadcn/ui/button'
import { Input } from '@/modules/shadcn/ui/input'
import { Search } from 'lucide-react'
import { EmptyContent } from 'tessera-ui'
import { IQueryConfig } from '@/resources/types'
import { auditLogColumns } from './audit.columns'
import { useFeatureAuditLog } from '@/resources/features'
import { DetailContent } from '../detail-content'

interface Props {
  config: IQueryConfig
  featureId?: string
}

export function FeatureAuditLogDetailContent({ config, featureId: initialFeatureId }: Props) {
  const [featureId, setFeatureId] = useState(initialFeatureId ?? '')
  const [searchInput, setSearchInput] = useState(initialFeatureId ?? '')

  const { data, isLoading, error } = useFeatureAuditLog(config, featureId, {
    enabled: !!featureId,
  })

  const handleSearch = () => {
    setFeatureId(searchInput.trim())
  }

  return (
    <DetailContent title="Audit History">
      <div className="flex items-center gap-2 mb-5">
        <Input
          placeholder="Enter feature ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={!searchInput.trim()}>
          <Search className="h-4 w-4" />
          Lookup
        </Button>
      </div>

      {!featureId ? (
        <EmptyContent
          title="Enter a feature ID"
          description="Paste a feature ID above to view its audit history."
          image="/images/empty-data.png"
        />
      ) : isLoading ? (
        <AppPreloader className="min-h-screen" />
      ) : data === undefined || error ? (
        <EmptyContent
          title="Oops, looks like we're failed to fetch audit history"
          description={error?.message}
          image="/images/empty-data.png"
        />
      ) : data.length === 0 ? (
        <EmptyContent
          title="No audit history"
          description="No actions have been recorded for this feature yet."
          image="/images/empty-data.png"
        />
      ) : (
        <DataTable
          fixed={false}
          columns={auditLogColumns}
          data={[...data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )}
        />
      )}
    </DetailContent>
  )
}
