import { PROPERTY_SUN_LIGHT } from 'src/shared/const'
import { z } from 'zod'

export const createPropertySchema = z.object({
  lotId: z.string(),
  noComplement: z.boolean(),
  propertyNumber: z.string().optional(),
  block: z.string().optional(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional()
})

export type CreateProperty = z.infer<typeof createPropertySchema>

export const updatePropertySchema = z.object({
  noComplement: z.boolean(),
  block: z.string().optional(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional()
})

export type UpdateProperty = z.infer<typeof updatePropertySchema>
