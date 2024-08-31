import { PROPERTY_SUN_LIGHT } from 'src/shared/const';
import { z } from 'zod';

export const createPropertySchema = z.object({
  block: z.string(),
  propertyNumber: z.string(),
  mainAddressId: z.string(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.array(z.string()).optional(),
});

export type CreateProperty = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = z.object({
  block: z.string().optional(),
  propertyNumber: z.string().optional(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.array(z.string()).optional(),
});

export type UpdateProperty = z.infer<typeof updatePropertySchema>;
