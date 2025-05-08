import { InjectModel } from '@nestjs/mongoose'
import { PaginatedData } from '@src/shared/types/response'
import { Model } from 'mongoose'
import { LeanDoc } from 'src/shared/types/mongoose'

import { Comment } from '../../schemas/comment.schema'
import {
  CommentTopic,
  InterfaceComment
} from '../../schemas/models/comment.interface'
import { CommentRepository } from '../comment.repository'

export class CommentMongooseRepository implements CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>
  ) {}

  async createComment(
    newComment: InterfaceComment
  ): Promise<InterfaceComment | null> {
    const createdComment = new this.commentModel({
      ...newComment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    await createdComment.save()

    if (!createdComment) return null

    return await this.getOneCommentById(createdComment._id.toString())
  }

  async getOneCommentById(id: string): Promise<InterfaceComment> {
    const data = await this.commentModel
      .findById(id)
      .lean<LeanDoc<InterfaceComment>>()
      .exec()

    if (!data) {
      return null
    }

    const { _id, __v, ...otherData } = data

    return { ...otherData, id: _id.toString() }
  }

  async getCommentsByTarget(
    targetId: string,
    page: number = 1,
    limit: number = 6
  ): Promise<PaginatedData<InterfaceComment>> {
    const data = await this.commentModel
      .find({
        target: {
          targetId: targetId
        }
      })
      .skip(page)
      .limit(limit)
      .lean<LeanDoc<InterfaceComment>[]>()
      .exec()

    if (!data) {
      return null
    }

    const totalItems = await this.commentModel.countDocuments({
      target: {
        targetId: targetId
      }
    })
    const totalPages = Math.ceil(totalItems / limit)

    const result = {
      list: data.map((property) => {
        const { _id: id, __v, ...otherData } = property

        return { id: id.toString(), ...otherData }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async getCommentsByTargetAndTopic(
    targetId: string,
    topic: CommentTopic,
    page: number = 1,
    limit: number = 6
  ): Promise<PaginatedData<InterfaceComment>> {
    const data = await this.commentModel
      .find({
        topic: topic,
        target: {
          targetId: targetId
        }
      })
      .skip(page)
      .limit(limit)
      .lean<LeanDoc<InterfaceComment>[]>()
      .exec()

    if (!data) {
      return null
    }

    const totalItems = await this.commentModel.countDocuments({
      topic: topic,
      target: {
        targetId: targetId
      }
    })
    const totalPages = Math.ceil(totalItems / limit)

    const result = {
      list: data.map((property) => {
        const { _id: id, __v, ...otherData } = property

        return { id: id.toString(), ...otherData }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async getCommentsByLot(
    lotId: string,
    page: number = 1,
    limit: number = 1
  ): Promise<PaginatedData<InterfaceComment>> {
    // TODO: limitar a retornar comentários criados nos últimos 3 anos
    const data = await this.commentModel
      .find({
        relationship: {
          relativeTo: 'lot',
          relativeId: lotId
        },
        validation: 'public',
        authorPrivacy: 'allowed'
      })
      .skip(page)
      .limit(limit)
      .lean<LeanDoc<InterfaceComment>[]>()
      .exec()

    if (!data) {
      return null
    }

    const totalItems = await this.commentModel.countDocuments({
      relationship: {
        relativeTo: 'lot',
        relativeId: lotId
      },
      validation: 'public',
      authorPrivacy: 'allowed'
    })
    const totalPages = Math.ceil(totalItems / limit)

    const result = {
      list: data.map((property) => {
        const { _id: id, __v, ...otherData } = property

        return { id: id.toString(), ...otherData }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async getCommentsByProperty(
    propertyId: string,
    page: number = 1,
    limit: number = 6
  ): Promise<PaginatedData<InterfaceComment>> {
    // TODO: limitar a retornar comentários criados nos últimos 3 anos
    const data = await this.commentModel
      .find({
        relationship: {
          relativeTo: 'property',
          relativeId: propertyId
        },
        validation: 'public',
        authorPrivacy: 'allowed'
      })
      .skip(page)
      .limit(limit)
      .lean<LeanDoc<InterfaceComment>[]>()
      .exec()

    if (!data) {
      return null
    }

    const totalItems = await this.commentModel.countDocuments({
      relationship: {
        relativeTo: 'property',
        relativeId: propertyId
      },
      validation: 'public',
      authorPrivacy: 'allowed'
    })
    const totalPages = Math.ceil(totalItems / limit)

    const result = {
      list: data.map((property) => {
        const { _id: id, __v, ...otherData } = property

        return { id: id.toString(), ...otherData }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async updateComment(
    id: string,
    data: Partial<InterfaceComment>
  ): Promise<InterfaceComment> {
    const foundComment = await this.getOneCommentById(id)

    if (!foundComment) return

    await this.commentModel
      .updateOne(
        { _id: id },
        { ...foundComment, ...data, updatedAt: new Date().toISOString() }
      )
      .exec()

    const updated = await this.getOneCommentById(id)

    return updated
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentModel.deleteOne({ _id: id }).exec()
  }
}
