import { fetchApi } from '@/libraries/fetch'
import { IEnabledFeatures, IFeatureCheck } from './check.type'
import { IQueryConfig } from '../types'

const FEATURE_CHECK_ENDPOINT = 'feature-checks'
const ENABLED_FEATURES_ENDPOINT = 'enabled-features'

export async function checkFeature(
  config: IQueryConfig,
  key: string,
  actorId?: string | null
): Promise<IFeatureCheck> {
  const searchParams = new URLSearchParams()
  if (actorId) {
    searchParams.set('actor_id', actorId)
  }
  const queryString = searchParams.toString()

  const res = await fetchApi(
    `${config.apiUrl}/${FEATURE_CHECK_ENDPOINT}/${encodeURIComponent(key)}${
      queryString ? `?${queryString}` : ''
    }`,
    config.token,
    config.nodeEnv,
    { method: 'GET' }
  )

  return res as IFeatureCheck
}

export async function listEnabledFeatures(
  config: IQueryConfig,
  actorId?: string | null
): Promise<IEnabledFeatures> {
  const searchParams = new URLSearchParams()
  if (actorId) {
    searchParams.set('actor_id', actorId)
  }
  const queryString = searchParams.toString()

  const res = await fetchApi(
    `${config.apiUrl}/${ENABLED_FEATURES_ENDPOINT}${queryString ? `?${queryString}` : ''}`,
    config.token,
    config.nodeEnv,
    { method: 'GET' }
  )

  return res as IEnabledFeatures
}
