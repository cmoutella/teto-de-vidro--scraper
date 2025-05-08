import { z } from 'zod'

export const ZPropertyHuntingStage = z.enum([
  'new',
  'iniciated',
  'returned',
  'disappeared',
  'unavailable',
  'scheduled',
  'visited',
  'quit',
  'submitted',
  'approved',
  'denied'
])
