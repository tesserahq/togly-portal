/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query'
import { IQueryConfig, QueryError } from '../types'
import { checkFeature, listEnabledFeatures } from './check.queries'
import { IEnabledFeatures, IFeatureCheck } from './check.type'

export function useCheckFeature(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: IFeatureCheck) => void
    onError?: (error: QueryError) => void
  }
) {
  return useMutation({
    mutationFn: async ({ key, actorId }: { key: string; actorId?: string | null }) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'UNAUTHORIZED')
        }
        return await checkFeature(config, key, actorId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

export function useListEnabledFeatures(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: IEnabledFeatures) => void
    onError?: (error: QueryError) => void
  }
) {
  return useMutation({
    mutationFn: async ({ actorId }: { actorId?: string | null }) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'UNAUTHORIZED')
        }
        return await listEnabledFeatures(config, actorId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
