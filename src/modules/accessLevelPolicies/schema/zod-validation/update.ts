import { z } from 'zod'

export const updateLevelPoliciesSchema = z.object({
  invitationsLimit: z.number().optional(),
  activeHuntsLimit: z.number().optional(),
  targetsPerHuntLimit: z.number().optional()
})

export type UpdateLevelPoliciesData = z.infer<typeof updateLevelPoliciesSchema>
