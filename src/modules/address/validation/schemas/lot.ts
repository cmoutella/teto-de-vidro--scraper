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
