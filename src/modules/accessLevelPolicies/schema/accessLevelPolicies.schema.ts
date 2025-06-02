import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

import { AccessLevelPoliciesInterface } from './model/access-policies.interface'

export type InvitationDocument = HydratedDocument<AccessLevelPolicies>

@Schema()
export class AccessLevelPolicies implements AccessLevelPoliciesInterface {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string

  @ApiProperty()
  @Prop()
  level: number
  @ApiProperty()
  @Prop()
  invitationsLimit: number
  @ApiProperty()
  @Prop()
  activeHuntsLimit: number
  @ApiProperty()
  @Prop()
  targetsPerHuntLimit: number

  @ApiProperty()
  @Prop()
  createdAt: string
  @ApiProperty()
  @Prop()
  updatedAt: string
}

export const AccessLevelPoliciesSchema =
  SchemaFactory.createForClass(AccessLevelPolicies)
