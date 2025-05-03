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

export const updateCommentSchema = z.object({
  comment: z.string().optional(),
  topic: CommentTopic.optional(),
  relationship: z
    .object({
      relativeTo: CommentRelatedTo,
      relativeId: z.string()
    })
    .optional(),
  authorPrivacy: AuthorPrivacy.optional(),
  validation: CommentRatedAs.optional()
})
