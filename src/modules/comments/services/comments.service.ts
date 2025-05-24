import { Injectable } from '@nestjs/common'
import { PaginatedData } from '@src/shared/types/response'

import { CommentRepository } from '../repositories/comment.repository'
import {
  CommentMainRelationship,
  CommentTopic,
  InterfaceComment
} from '../schemas/models/comment.interface'
import { CreateCommentData } from '../schemas/zod-validation/create'

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    newComment: CreateCommentData
  ): Promise<InterfaceComment> {
    const createdComment = await this.commentRepository.createComment(
      newComment as never
    )

    return createdComment
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

  async mountRelationship(
    topic: CommentTopic,
    propertyId?: string,
    lotId?: string
  ): Promise<CommentMainRelationship> {
    let relation
    switch (topic) {
      case 'lot':
        relation = 'lot'
        break
      case 'surroundings':
        relation = 'lot'
        break
      case 'property':
        relation = 'property'
        break
      case 'owner':
        relation = 'property'
        break
      case 'agency':
        relation = undefined
        break
      default:
        relation = 'property'
        break
    }

    const relationId =
      relation === 'lot'
        ? lotId
        : relation === 'property'
          ? propertyId
          : undefined

    return {
      relativeTo: relation,
      relativeId: relationId
    }
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
