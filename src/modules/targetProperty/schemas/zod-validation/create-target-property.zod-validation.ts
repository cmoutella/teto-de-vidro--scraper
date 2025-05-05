import { AMENITY_REPORTED_BY, PROPERTY_SUN_LIGHT } from '@src/shared/const'
import { z } from 'zod'

export const createTargetPropertySchema = z.object({
  huntId: z.string(),
  adURL: z.string(),
  sellPrice: z.number(),
  rentPrice: z.number(),
  iptu: z.number().optional(),

  nickname: z.string().optional(),
  street: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  uf: z.string(),
  country: z.string(),
  postalCode: z.string().optional(),
  condoPricing: z.number().optional(),

  lotName: z.string().optional(),
  noLotNumber: z.boolean(),
  lotNumber: z.string().optional(),
  targetAmenities: z
    .array(
      z.object({
        identifier: z.string().optional(),
        reportedBy: z.enum(AMENITY_REPORTED_BY),
        userId: z.string().optional()
      })
    )
    .optional(),

  noComplement: z.boolean(),
  block: z.string().optional(),
  propertyNumber: z.string().optional(),

  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  contactName: z.string().optional(),
  contactWhatzap: z.string().optional()
})

export type CreateTargetProperty = z.infer<typeof createTargetPropertySchema>
