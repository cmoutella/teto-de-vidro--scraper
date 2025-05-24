import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

import { InterfaceUser } from './models/user.interface'

export enum CommentRatedAsEnum {
  beta = 'beta',
  guest = 'guest',
  regular = 'regular',
  tester = 'tester'
}

export enum GenderAsEnum {
  male = 'male',
  female = 'female',
  neutral = 'neutral'
}

export type UserDocument = HydratedDocument<User>

@Schema()
export class User implements InterfaceUser {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string

  // IDENTIFY USER
  @ApiProperty({ required: true })
  @Prop({ required: true })
  name: string
  @ApiProperty()
  @Prop()
  familyName: string
  @ApiProperty()
  @Prop()
  cpf: string
  @ApiProperty({ required: true })
  @Prop({ required: true })
  email: string

  // ACCESS
  @ApiProperty({ required: true })
  @Prop({ required: true })
  accessLevel: number
  @ApiProperty({ enum: CommentRatedAsEnum, required: true })
  @Prop({ enum: CommentRatedAsEnum, required: true })
  status: CommentRatedAsEnum

  // PROFILING
  @ApiProperty()
  @Prop()
  profession: string
  @ApiProperty()
  @Prop({ enum: GenderAsEnum })
  gender: GenderAsEnum
  @ApiProperty()
  @Prop()
  birthDate: string

  // USER SETTINGS
  @ApiProperty()
  @Prop()
  password: string

  // HISTORY
  @ApiProperty()
  @Prop({ required: true })
  createdAt: string
  @ApiProperty()
  @Prop({ required: true })
  updatedAt: string
  @ApiProperty()
  @Prop()
  lastLogin: string
}

export const UserSchema = SchemaFactory.createForClass(User)

export class PublicUserSchema {
  @ApiProperty()
  @Prop()
  id: string
  @ApiProperty()
  @Prop()
  nickName: string
  @ApiProperty()
  @Prop()
  name: string
  @ApiProperty()
  @Prop()
  profession: string
  @ApiProperty()
  @Prop()
  gender: string
  @ApiProperty()
  @Prop()
  birthDate: string
  @ApiProperty()
  @Prop()
  email: string
}
