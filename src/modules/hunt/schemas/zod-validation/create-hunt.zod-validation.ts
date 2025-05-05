import { CONTRACT_TYPE } from '@src/shared/const'
import { z } from 'zod'

export const createHuntSchema = z.object({
  creatorId: z.string(),
  invitedUsers: z.array(z.string()).optional(),
  title: z.string().optional(),
  movingExpected: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  livingPeople: z.number().optional(),
  livingPets: z.number().optional(),
  type: z.enum(CONTRACT_TYPE).optional()
})

export type CreateHunt = z.infer<typeof createHuntSchema>
