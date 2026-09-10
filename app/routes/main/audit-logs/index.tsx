import { useLoaderData, useParams } from 'react-router'
import { useApp } from 'tessera-ui'
import { IQueryConfig } from '@/resources/types'
import { FeatureAuditLogDetailContent } from '@/components/audit-log-page/content'

export async function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv }
}

export default function FeatureAuditLog() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()

  const config: IQueryConfig = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  return <FeatureAuditLogDetailContent config={config} />
}
