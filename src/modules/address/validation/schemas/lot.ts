import { z } from 'zod';

export const createLotSchema = z.object({
  lotName: z.string().optional(),
  street: z.string(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().optional(),
  country: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),
});

export type CreateLot = z.infer<typeof createLotSchema>;

export const updateLotSchema = z.object({
  lotName: z.string().optional(),
});

export type UpdateLot = z.infer<typeof updateLotSchema>;

export const searchLotsSchema = z.object({
  street: z.string(),
  city: z.string(),
  neighborhood: z.string().optional(),
  uf: z.string(),
  country: z.string(),
  block: z.string().optional(),
  lotName: z.string().optional(),
  lotNumber: z.string().optional(),
  postalCode: z.string().optional(),
  propertyNumber: z.string().optional(),
});

export type SearchLots = z.infer<typeof searchLotsSchema>;
