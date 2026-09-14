import { FeatureCheckContent } from '@/components/feature-check-page/content'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { useLoaderData } from 'react-router'

export async function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv }
}

export default function FeaturesCheckPage() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token, isLoading } = useApp()

  const config = { apiUrl: apiUrl!, token: token ?? '', nodeEnv }

  if (isLoading) {
    return <AppPreloader />
  }

  return <FeatureCheckContent config={config} />
}
