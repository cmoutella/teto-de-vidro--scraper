import { PROPERTY_SUN_LIGHT } from 'src/shared/const';
import { z } from 'zod';

export const createAddressSchema = z.object({
  block: z.string().optional(),
  street: z.string(),
  lotName: z.string().optional(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  city: z.string(),
  neighborhood: z.string(),
  province: z.string(),
  country: z.string(),
  lotConvenience: z.array(z.string()).optional(),
  propertyNumber: z.string(),
  size: z.number().optional(),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  is_front: z.boolean().optional(),
  sun: z.enum(PROPERTY_SUN_LIGHT).optional(),
  condoPricing: z.number().optional(),
  propertyConvenience: z.array(z.string()).optional(),
});

export type CreateAddress = z.infer<typeof createAddressSchema>;

export const searchAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  province: z.string(),
  country: z.string(),
  block: z.string().optional(),
  lotName: z.string().optional(),
  lotNumber: z.string().optional(),
  postalCode: z.string().optional(),
  propertyNumber: z.string(),
});

export type SearchAddress = z.infer<typeof searchAddressSchema>;
