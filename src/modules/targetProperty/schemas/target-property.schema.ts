import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

import {
  InterfaceTargetProperty,
  PropertyHuntingStage,
  TargetAmenity
} from './models/target-property.interface'

export type PropertyDocument = HydratedDocument<TargetProperty>

@Schema()
export class TargetProperty implements InterfaceTargetProperty {
  lotName?: string
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string
  // básicos de um target

  @ApiPropertyOptional()
  @Prop()
  createdAt: string
  @ApiPropertyOptional()
  @Prop()
  updatedAt: string

  @ApiProperty()
  @Prop()
  huntId: string
  @ApiProperty()
  @Prop()
  adURL: string
  @ApiProperty()
  @Prop()
  nickname: string
  @ApiProperty()
  @Prop()
  rentPrice: number
  @ApiProperty()
  @Prop()
  sellPrice: number
  @ApiProperty()
  @Prop()
  iptu: number
  @ApiProperty()
  @Prop()
  priority: number
  @ApiProperty()
  @Prop()
  huntingStage: PropertyHuntingStage
  @ApiProperty()
  @Prop()
  isActive: boolean
  @ApiPropertyOptional()
  @Prop()
  visitDate?: string

  // contact
  @ApiPropertyOptional()
  @Prop()
  contactName?: string
  @ApiPropertyOptional()
  @Prop()
  contactWhatzap?: string
  @Prop()
  realState?: string
  @ApiPropertyOptional()
  @Prop()
  realStatePhoneNumber?: string

  // para vincular ou criar um endereço
  // lot
  @ApiPropertyOptional()
  @Prop()
  lotId?: string
  @Prop()
  street: string
  @ApiPropertyOptional()
  @Prop()
  noName: string
  @ApiProperty()
  @Prop()
  noLotNumber: boolean
  @ApiPropertyOptional()
  @Prop()
  lotNumber?: string
  @ApiPropertyOptional()
  @Prop()
  postalCode?: string
  @ApiProperty()
  @Prop()
  neighborhood: string
  @ApiProperty()
  @Prop()
  uf: string
  @ApiProperty()
  @Prop()
  city: string
  @ApiProperty()
  @Prop()
  country: string

  @ApiProperty()
  @Prop()
  targetAmenities?: TargetAmenity[]

  // property
  @ApiPropertyOptional()
  @Prop()
  propertyId?: string
  @ApiProperty()
  @Prop()
  noComplement: boolean
  @ApiPropertyOptional()
  @Prop()
  block?: string
  @ApiPropertyOptional()
  @Prop()
  propertyNumber?: string
  @ApiPropertyOptional()
  @Prop()
  size?: number
  @ApiPropertyOptional()
  @Prop()
  rooms?: number
  @ApiPropertyOptional()
  @Prop()
  bathrooms?: number
  @ApiPropertyOptional()
  @Prop()
  parking?: number
  @ApiPropertyOptional()
  @Prop()
  is_front?: boolean
  @ApiPropertyOptional()
  @Prop()
  sun?: 'morning' | 'afternoon' | 'none'
  @ApiPropertyOptional()
  @Prop()
  condoPricing?: number
}

export const TargetPropertySchema = SchemaFactory.createForClass(TargetProperty)
