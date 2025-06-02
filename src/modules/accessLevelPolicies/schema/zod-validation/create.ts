import { z } from 'zod'

export const createLevelPoliciesSchema = z.object({
  level: z.number(),
  invitationsLimit: z.number(),
  activeHuntsLimit: z.number(),
  targetsPerHuntLimit: z.number()
})

export type CreateLevelPoliciesData = z.infer<typeof createLevelPoliciesSchema>
