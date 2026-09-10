import { fetchApi } from '@/libraries/fetch'
import { IAuditLogEntry, IFeature, IGate } from './feature.type'
import { TCreateFeatureInput } from './feature.schema'
import { IPaging, IQueryConfig, IQueryParams } from '../types'

const RESOURCE_ENDPOINT = 'features'

export async function getFeatures(
  config: IQueryConfig,
  params: IQueryParams
): Promise<IPaging<IFeature>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size } = params

  const res = await fetchApi(`${apiUrl}/${RESOURCE_ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
  })

  return res as IPaging<IFeature>
}

export async function getFeature(config: IQueryConfig, key: string): Promise<IFeature> {
  const res = await fetchApi(
    `${config.apiUrl}/${RESOURCE_ENDPOINT}/${key}`,
    config.token,
    config.nodeEnv
  )

  return res as IFeature
}

export async function createFeature(
  config: IQueryConfig,
  payload: TCreateFeatureInput
): Promise<IFeature> {
  const res = await fetchApi(
    `${config.apiUrl}/${RESOURCE_ENDPOINT}`,
    config.token,
    config.nodeEnv,
    { method: 'POST', body: JSON.stringify(payload) }
  )

  return res as Promise<IFeature>
}

export async function deleteFeature(config: IQueryConfig, key: string): Promise<void> {
  await fetchApi(`${config.apiUrl}/${RESOURCE_ENDPOINT}/${key}`, config.token, config.nodeEnv, {
    method: 'DELETE',
  })
}

export async function enableBooleanGate(config: IQueryConfig, key: string): Promise<IGate> {
  const res = await fetchApi(
    `${config.apiUrl}/${RESOURCE_ENDPOINT}/${key}/gates/boolean`,
    config.token,
    config.nodeEnv,
    { method: 'POST' }
  )

  return res as Promise<IGate>
}

export async function disableBooleanGate(config: IQueryConfig, key: string): Promise<void> {
  await fetchApi(
    `${config.apiUrl}/${RESOURCE_ENDPOINT}/${key}/gates/boolean`,
    config.token,
    config.nodeEnv,
    { method: 'DELETE' }
  )
}

export async function enableActorGate(
  config: IQueryConfig,
  key: string,
  actorId: string
): Promise<IGate> {
  const res = await fetchApi(
    `${config.apiUrl}/${RESOURCE_ENDPOINT}/${key}/gates/actors/${actorId}`,
    config.token,
    config.nodeEnv,
    { method: 'POST' }
  )

  return res as Promise<IGate>
}

export async function disableActorGate(
  config: IQueryConfig,
  key: string,
  actorId: string
): Promise<void> {
  await fetchApi(
    `${config.apiUrl}/${RESOURCE_ENDPOINT}/${key}/gates/actors/${actorId}`,
    config.token,
    config.nodeEnv,
    { method: 'DELETE' }
  )
}

const AUDIT_LOG_ENDPOINT = 'feature-audit-logs'

export async function getFeatureAuditLog(
  config: IQueryConfig,
  featureId: string
): Promise<IAuditLogEntry[]> {
  const res = await fetchApi(
    `${config.apiUrl}/${AUDIT_LOG_ENDPOINT}/${featureId}`,
    config.token,
    config.nodeEnv
  )

  return res as IAuditLogEntry[]
}
