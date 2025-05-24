import { ZPropertyHuntingStage } from '@src/modules/targetProperty/schemas/zod-validation/shared'
import { z } from 'zod'

export type AuthorPrivacy = 'allowed' | 'denied'

export type CommentRelatedTo = 'lot' | 'property'

export type CommentTopic =
  | CommentRelatedTo
  | 'surroundings'
  | 'owner'
  | 'agency'
  | string

export type CommentRatedAs = 'waiting' | 'public' | 'offensive'

export const CommentTopic = z
  .enum(['lot', 'property', 'surroundings', 'owner', 'agency'])
  .or(z.string())
export const CommentRelatedTo = z.enum(['lot', 'property'])
export const AuthorPrivacy = z.enum(['allowed', 'denied'])
export const CommentRatedAs = z.enum(['waiting', 'public', 'offensive'])

export const createCommentSchema = z.object({
  comment: z.string(),
  topic: CommentTopic,
  relationship: z
    .object({
      relativeTo: CommentRelatedTo,
      relativeId: z.string()
    })
    .optional(),
  author: z.string(),
  authorPrivacy: AuthorPrivacy,
  target: z
    .object({
      targetId: z.string(),
      stage: ZPropertyHuntingStage
    })
    .optional()
})

export type CreateCommentData = z.infer<typeof createCommentSchema>
