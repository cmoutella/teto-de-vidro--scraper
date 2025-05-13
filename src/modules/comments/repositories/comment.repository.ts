import type { PaginatedData } from '@src/shared/types/response'

import type {
  CommentTopic,
  InterfaceComment
} from '../schemas/models/comment.interface'
import type { CreateCommentData } from '../schemas/zod-validation/create'

export abstract class CommentRepository {
  abstract getOneCommentById(id: string): Promise<InterfaceComment>

  abstract getCommentsByTarget(
    targetId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>>

  abstract getCommentsByTargetAndTopic(
    targetId: string,
    topic: CommentTopic,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>>

  abstract getCommentsByLot(
    lotId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>>

  abstract getCommentsByProperty(
    propertyId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>>

  abstract createComment(
    newComment: CreateCommentData
  ): Promise<InterfaceComment | null>

  abstract updateComment(
    id: string,
    data: Partial<InterfaceComment>
  ): Promise<InterfaceComment>

  abstract deleteComment(id: string): Promise<void>
}
