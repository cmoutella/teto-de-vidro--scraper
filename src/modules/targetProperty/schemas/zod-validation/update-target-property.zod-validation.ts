import { PROPERTY_SUN_LIGHT } from '@src/shared/const'
import { z } from 'zod'

import { ZPropertyHuntingStage } from './shared'

export const updateTargetPropertySchema = z.object({
  nickname: z.string().optional(),
  priority: z.number().optional(),
  huntingStage: ZPropertyHuntingStage.optional(),
  isActive: z.boolean().optional(),
  contactName: z.string().optional(),
  contactWhatzap: z.string().optional(),
  visitDate: z.string().optional(),

  sellPrice: z.number().optional(),
  rentPrice: z.number().optional(),
  iptu: z.number().optional(),
  condoPricing: z.number().optional(),

  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),

  lotName: z.string().optional(),
  noLotNumber: z.boolean().optional(),
  lotNumber: z.string().optional(),

  noComplement: z.boolean().optional(),
  block: z.string().optional(),
  propertyNumber: z.string().optional(),

  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional()
})

export type UpdateTargetProperty = z.infer<typeof updateTargetPropertySchema>
