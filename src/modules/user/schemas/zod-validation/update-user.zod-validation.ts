import { z } from 'zod'

import { GENDERS, USER_STATUS } from './shared'

// user data
export const updateUserSchema = z.object({
  name: z.string(),
  familyName: z.string(),

  accessLevel: z.number().optional(),
  role: z.enum(USER_STATUS).optional(),

  profession: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  birthDate: z.string(),

  password: z.string()
})
export type UpdateUser = z.infer<typeof updateUserSchema>

// user email
export const updateUserEmailSchema = z.object({
  email: z.string()
})
export type UpdateEmail = z.infer<typeof updateUserEmailSchema>

// user access level
export const updateUserAccessSchema = z.object({
  accessLevel: z.number().optional(),
  role: z.enum(USER_STATUS).optional()
})
export type UpdateLevel = z.infer<typeof updateUserAccessSchema>

// change password
export const changePasswordSchema = z.object({
  password: z.string()
})
export type ChangePassword = z.infer<typeof changePasswordSchema>
