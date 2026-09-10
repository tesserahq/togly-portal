/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createFeature,
  deleteFeature,
  disableActorGate,
  disableBooleanGate,
  enableActorGate,
  enableBooleanGate,
  getFeature,
  getFeatureAuditLog,
  getFeatures,
} from './feature.queries'
import { IFeature, IGate } from './feature.type'
import { TCreateFeatureInput } from './feature.schema'
import { IQueryConfig, IQueryParams } from '../types'

class QueryError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'QueryError'
    this.code = code
  }
}

export const featureQueryKeys = {
  all: ['features'] as const,
  lists: () => [...featureQueryKeys.all, 'list'] as const,
  list: (params: IQueryParams) => [...featureQueryKeys.lists(), params] as const,
  detail: (key: string) => [...featureQueryKeys.all, 'detail', key] as const,
  auditLog: () => ['feature-audit-logs'] as const,
  auditLogDetail: (featureId: string) => [...featureQueryKeys.auditLog(), featureId] as const,
}

export function useFeatures(
  config: IQueryConfig,
  params: IQueryParams,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: featureQueryKeys.list(params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await getFeatures(config, params)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false && !!config.token && !!config.apiUrl,
  })
}

export function useGetFeature(
  config: IQueryConfig,
  key: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: featureQueryKeys.detail(key),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await getFeature(config, key)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false && !!key && !!config.token && !!config.apiUrl,
  })
}

export function useCreateFeature(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: IFeature) => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TCreateFeatureInput) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await createFeature(config, payload)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() })
      toast.success('Feature created successfully!', { duration: 3000 })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      toast.error('Failed to create Feature', {
        description: error?.message || 'Please try again.',
      })
      options?.onError?.(error)
    },
  })
}

export function useDeleteFeature(
  config: IQueryConfig,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (key: string) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await deleteFeature(config, key)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (_, key) => {
      queryClient.removeQueries({ queryKey: featureQueryKeys.detail(key) })
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() })
      toast.success('Feature deleted successfully!', { duration: 3000 })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error('Failed to delete Feature', {
        description: error?.message || 'Please try again.',
      })
      options?.onError?.(error)
    },
  })
}

export function useEnableBooleanGate(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: IGate) => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ key }: { key: string }) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await enableBooleanGate(config, key)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (data, { key }) => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.detail(key) })
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() })
      toast.success('Feature enabled!', { duration: 3000 })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      toast.error('Failed to enable boolean gate', {
        description: error?.message || 'Please try again.',
      })
      options?.onError?.(error)
    },
  })
}

export function useDisableBooleanGate(
  config: IQueryConfig,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ key }: { key: string }) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await disableBooleanGate(config, key)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.detail(key) })
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() })
      toast.success('Feature disabled!', { duration: 3000 })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error('Failed to disable boolean gate', {
        description: error?.message || 'Please try again.',
      })
      options?.onError?.(error)
    },
  })
}

export function useEnableActorGate(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: IGate) => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ key, actorId }: { key: string; actorId: string }) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await enableActorGate(config, key, actorId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (data, { key }) => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.detail(key) })
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() })
      toast.success('Actor gate enabled!', { duration: 3000 })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      toast.error('Failed to enable actor gate', {
        description: error?.message || 'Please try again.',
      })
      options?.onError?.(error)
    },
  })
}

export function useDisableActorGate(
  config: IQueryConfig,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ key, actorId }: { key: string; actorId: string }) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await disableActorGate(config, key, actorId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.detail(key) })
      queryClient.invalidateQueries({ queryKey: featureQueryKeys.lists() })
      toast.success('Actor gate disabled!', { duration: 3000 })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error('Failed to disable actor gate', {
        description: error?.message || 'Please try again.',
      })
      options?.onError?.(error)
    },
  })
}

export function useFeatureAuditLog(
  config: IQueryConfig,
  featureId: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: featureQueryKeys.auditLogDetail(featureId),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await getFeatureAuditLog(config, featureId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false && !!featureId && !!config.token && !!config.apiUrl,
  })
}
