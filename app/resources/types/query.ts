import { NodeENVType } from '@/libraries/fetch'

/**
 * Contact query configuration
 * Required configuration for API queries (apiUrl, token, nodeEnv)
 */
export interface IQueryConfig {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
}

/**
 * Contact query parameters for pagination
 */
export interface IQueryParams {
  page?: number
  size?: number
  q?: string
}

export class QueryError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'QueryError'
    this.code = code
  }
}
