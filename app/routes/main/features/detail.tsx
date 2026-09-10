import { FeatureDetailContent } from '@/components/feature-page'
import { useApp } from '@/context/AppContext'
import { useLoaderData } from 'react-router'

export async function loader({ params }: { params: { featureKey: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, key: params.featureKey }
}

export default function FeaturesDetail() {
  const { apiUrl, nodeEnv, key } = useLoaderData<typeof loader>()
  const { token } = useApp()

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }
  return <FeatureDetailContent config={config} featureKey={key} />
}
