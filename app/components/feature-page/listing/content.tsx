import { DataTable } from '@/components/data-table'
import { columns } from './column'
import { NodeENVType } from '@/libraries/fetch'
import { EmptyContent, NewButton } from 'tessera-ui'
import { useFeatures } from '@/resources/features'
import { useNavigate } from 'react-router'

interface props {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  pagination: {
    page: number
    size: number
  }
  authLoading: boolean
}

export function FeaturesListing({ apiUrl, token, nodeEnv, pagination, authLoading }: props) {
  const navigate = useNavigate()
  const { data, isLoading, error } = useFeatures(
    { apiUrl, token, nodeEnv },
    { page: pagination.page, size: pagination.size },
    {
      enabled: !!token && !authLoading,
    }
  )

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-data.png"
        title="Failed to get features"
        description={error.message}
      />
    )
  }

  if (data?.total === 0) {
    return (
      <EmptyContent
        image="/images/empty-data.png"
        title="No features flag found"
        description="No features flag are available.">
        <NewButton title="New Feature Flag" onClick={() => navigate('new')} disabled={isLoading} />
      </EmptyContent>
    )
  }

  const meta = data
    ? {
        page: data.page,
        pages: data.pages,
        size: data.size,
        total: data.total,
      }
    : undefined

  return (
    <div className="h-full page-content">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="page-title">Features</h1>
        <NewButton label="New Feature Flag" onClick={() => navigate('new')} disabled={isLoading} />
      </div>

      <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
    </div>
  )
}
