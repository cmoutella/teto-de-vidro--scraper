import type { PropertyHuntingStage } from '@src/modules/targetProperty/schemas/models/target-property.interface'

export type AuthorPrivacy = 'allowed' | 'denied'

export type CommentRelatedTo = 'lot' | 'property'

export type CommentMainRelationship = {
  relativeTo: CommentRelatedTo
  relativeId: string
}

export type CommentTopic =
  | CommentRelatedTo
  | 'surroundings'
  | 'owner'
  | 'agency'
  | string

export type CommentRatedAs = 'waiting' | 'public' | 'offensive'

export interface InterfaceComment {
  id: string
  comment: string
  topic: CommentTopic
  relationship: CommentMainRelationship

  author: string
  authorPrivacy: AuthorPrivacy
  validation: CommentRatedAs

  target?: {
    targetId: string
    stage: PropertyHuntingStage
  }

  createdAt: string
  updatedAt: string
}

export interface SuccessComment extends Omit<InterfaceComment, 'author'> {
  author: {
    userId: string
    userName: string
  }
}
