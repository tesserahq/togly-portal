// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { createFeatureSchema } from './feature.schema'
import { featureCheckFormSchema } from '../feature-check/check.schema'

describe('feature schemas', () => {
  it('requires a feature key while allowing a nullable description', () => {
    expect(createFeatureSchema.safeParse({ key: '' }).success).toBe(false)
    expect(createFeatureSchema.parse({ key: 'new-dashboard', description: null })).toEqual({
      key: 'new-dashboard',
      description: null,
    })
  })

  it('allows a blank actor ID for a global feature check', () => {
    expect(featureCheckFormSchema.parse({ key: 'new-dashboard', actor_id: '  ' })).toEqual({
      key: 'new-dashboard',
      actor_id: '',
    })
  })

  it('requires a feature to check', () => {
    expect(featureCheckFormSchema.safeParse({ key: '' }).success).toBe(false)
  })
})
