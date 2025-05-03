import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { PropertyHuntingStage } from '@src/modules/targetProperty/schemas/models/target-property.interface'
import mongoose, { HydratedDocument } from 'mongoose'

import {
  CommentRelatedTo,
  CommentTopic,
  InterfaceComment
} from './models/comment.interface'

export type PropertyDocument = HydratedDocument<Comment>

export enum CommentTopicEnum {
  lot = 'lot',
  property = 'property',
  surroundings = 'surroundings',
  owner = 'owner',
  agency = 'agency'
}

export enum CommentRelatedToEnum {
  lot = 'lot',
  property = 'property'
}

export enum AuthorPrivacyEnum {
  allowed = 'allowed',
  denied = 'denied'
}

export enum CommentRatedAsEnum {
  waiting = 'waiting',
  public = 'public',
  offensive = 'offensive'
}

export enum PropertyHuntingStageEnum {
  new = 'new',
  iniciated = 'iniciated',
  returned = 'returned',
  disappeared = 'disappeared',
  scheduled = 'scheduled',
  unavailable = 'unavailable',
  visited = 'visited',
  quit = 'quit',
  submitted = 'submitted',
  approved = 'approved',
  denied = 'denied'
}

@Schema()
export class Comment implements InterfaceComment {
  updatedAt: string
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string
  @ApiProperty()
  @Prop({ required: true })
  comment: string
  @ApiProperty()
  @Prop({ required: true, type: String })
  topic: CommentTopic | string

  @ApiProperty()
  @Prop({
    required: true,
    type: {
      relativeTo: { type: String, enum: Object.values(CommentRelatedToEnum) },
      relativeId: { type: String }
    }
  })
  relationship: {
    relativeTo: CommentRelatedTo
    relativeId: string
  }

  @ApiProperty()
  @Prop({ required: true })
  author: string
  @ApiProperty()
  @Prop({ required: true, enum: AuthorPrivacyEnum })
  authorPrivacy: AuthorPrivacyEnum
  @ApiProperty()
  @Prop({ required: true, enum: CommentRatedAsEnum })
  validation: CommentRatedAsEnum

  @ApiProperty()
  @Prop({
    required: false,
    type: {
      targetId: { type: String },
      stage: { type: String, enum: Object.values(PropertyHuntingStageEnum) }
    }
  })
  target?: {
    targetId: string
    stage: PropertyHuntingStage
  }

  @ApiProperty()
  @Prop()
  createdAt: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
