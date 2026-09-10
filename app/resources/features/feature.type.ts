export type EGateType = 'boolean' | 'actor'

export interface IGate {
  id: string
  gate_type: EGateType
  value: string
}

export interface IFeature {
  id: string
  key: string
  description: string | null
  created_at: string
  updated_at: string
  gates: IGate[]
}

export interface IAuditLogEntry {
  id: string
  feature_id: string
  feature_key: string
  user_id: string
  action: string
  snapshot: Record<string, unknown> | null
  created_at: string
}

export interface IFeatureCheck {
  key: string
  enabled: boolean
}

export interface IEnabledFeatures {
  features: string[]
}
