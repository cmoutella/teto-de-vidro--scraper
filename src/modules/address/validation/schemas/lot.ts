import { z } from 'zod';

export const createLotSchema = z.object({
  lotName: z.string().optional(),
  street: z.string(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),
});

export type CreateLot = z.infer<typeof createLotSchema>;

export const updateLotSchema = z.object({
  lotName: z.string().optional(),
  street: z.string(),
  lotNumber: z.string(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  lotConvenience: z.array(z.string()).optional(),
});

export type UpdateLot = z.infer<typeof updateLotSchema>;

export const searchLotSchema = z.object({
  lotNumber: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string(),
  city: z.string(),
  neighborhood: z.string().optional(),
  province: z.string(),
  country: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type SearchLot = z.infer<typeof searchLotSchema>;
