import { z } from 'zod'

export const createFeatureSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  description: z.string().nullable().optional(),
})

export type TCreateFeatureInput = z.infer<typeof createFeatureSchema>
