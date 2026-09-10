import { useLoaderData, useNavigate } from 'react-router'
import { useApp } from 'tessera-ui'
import { TCreateFeatureInput, useCreateFeature } from '@/resources/features'
import { FeatureForm } from '@/components/feature-page'
import { IQueryConfig } from '@/resources/types'

export async function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv }
}

const emptyDefaultValues: TCreateFeatureInput = {
  key: '',
  description: '',
}

export default function NewFeature() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const navigate = useNavigate()

  const config: IQueryConfig = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { mutateAsync: createFeature } = useCreateFeature(config, {
    onSuccess: () => {
      navigate(`/features`)
    },
  })

  const handleSubmit = async (data: TCreateFeatureInput): Promise<void> => {
    await createFeature(data)
  }

  return <FeatureForm defaultValues={emptyDefaultValues} onSubmit={handleSubmit} />
}
