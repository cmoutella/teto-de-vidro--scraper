import { Injectable } from '@nestjs/common'
import { PaginatedData } from '@src/shared/types/response'

import { CommentRepository } from '../repositories/comment.repository'
import {
  CommentTopic,
  InterfaceComment
} from '../schemas/models/comment.interface'

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    newComment: Omit<InterfaceComment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<InterfaceComment> {
    const createdAmenity =
      await this.commentRepository.createComment(newComment)

    return createdAmenity
  }

  async getOneCommentById(id: string): Promise<InterfaceComment> {
    if (!id) return undefined

    const comment = await this.commentRepository.getOneCommentById(id)

    if (!comment) return undefined

    return comment
  }

  async getCommentsByTarget(
    targetId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>> {
    return await this.commentRepository.getCommentsByTarget(
      targetId,
      page,
      limit
    )
  }

  async getCommentsByTargetAndTopic(
    targetId: string,
    topic: CommentTopic,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>> {
    return await this.commentRepository.getCommentsByTargetAndTopic(
      targetId,
      topic,
      page,
      limit
    )
  }

  async getCommentsByLot(
    lotId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>> {
    return await this.commentRepository.getCommentsByLot(lotId, page, limit)
  }

  async getCommentsByProperty(
    propertyId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceComment>> {
    return await this.commentRepository.getCommentsByProperty(
      propertyId,
      page,
      limit
    )
  }

  async updateComment(
    id: string,
    data: Partial<InterfaceComment>
  ): Promise<InterfaceComment> {
    return await this.commentRepository.updateComment(id, data)
  }

  async deleteComment(id: string): Promise<boolean> {
    if (!id) {
      return false
    }

    try {
      await this.commentRepository.deleteComment(id)

      return true
    } catch {
      return false
    }
  }
}
