import { z } from 'zod'

export const featureCheckFormSchema = z.object({
  key: z.string().min(1, 'Select a feature to check'),
  // Optional on purpose — an empty actor_id means "test the global gate".
  actor_id: z.string().trim().optional(),
})

export type TFeatureCheckFormInput = z.infer<typeof featureCheckFormSchema>
