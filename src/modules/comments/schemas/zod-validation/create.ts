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

const CommentTopic = z
  .enum(['lot', 'property', 'surroundings', 'owner', 'agency'])
  .or(z.string())
const CommentRelatedTo = z.enum(['lot', 'property'])
const AuthorPrivacy = z.enum(['allowed', 'denied'])
const CommentRatedAs = z.enum(['waiting', 'public', 'offensive'])

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
  validation: CommentRatedAs,
  target: z
    .object({
      targetId: z.string(),
      stage: ZPropertyHuntingStage
    })
    .optional()
})
