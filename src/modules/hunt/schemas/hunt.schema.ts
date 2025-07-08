import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

import { InterfaceHunt } from './models/hunt.interface'
export type HuntDocument = HydratedDocument<Hunt>

export enum HuntTypeEnum {
  buy = 'buy',
  rent = 'rent',
  either = 'either'
}

export enum InvitationStatusEnum {
  waiting = 'waiting',
  accepted = 'accepted'
}

export class HuntUserDto {
  @ApiProperty()
  @Prop()
  id: string

  @ApiProperty()
  @Prop()
  name: string

  @ApiProperty()
  @Prop({ type: String, enum: Object.values(InvitationStatusEnum) })
  status: InvitationStatusEnum
}

@Schema()
export class Hunt implements InterfaceHunt {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string

  @ApiProperty()
  @Prop()
  title: string
  @ApiProperty()
  @Prop({ type: String, enum: Object.values(HuntTypeEnum) })
  type: HuntTypeEnum
  @ApiProperty()
  @Prop()
  creatorId: string
  @ApiPropertyOptional()
  @Prop()
  minBudget?: number
  @ApiPropertyOptional()
  @Prop()
  maxBudget?: number
  @ApiProperty({ isArray: true, type: String })
  @Prop()
  targets: string[]
  @ApiProperty({ required: true, isArray: true, type: HuntUserDto })
  @Prop({ required: true, isArray: true, type: HuntUserDto })
  huntUsers: HuntUserDto[]
  @ApiProperty()
  @Prop()
  isActive: boolean
  @ApiPropertyOptional()
  @Prop()
  movingExpected?: string
  @ApiPropertyOptional()
  @Prop()
  livingPeople?: number
  @ApiProperty()
  @Prop()
  livingPets?: number
  @ApiProperty()
  @Prop()
  createdAt: string
  @ApiProperty()
  @Prop()
  updatedAt: string
}

export const HuntSchema = SchemaFactory.createForClass(Hunt)
