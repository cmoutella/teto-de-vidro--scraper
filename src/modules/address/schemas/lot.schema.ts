import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

import { InterfaceLot } from './models/lot.interface'
import { AddressAmenity } from './models/shared/shared.interface'

export type LotDocument = HydratedDocument<Lot>

@Schema()
export class Lot implements InterfaceLot {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string
  @ApiPropertyOptional()
  @Prop()
  lotName?: string
  @ApiProperty()
  @Prop()
  street: string
  @ApiProperty()
  @Prop()
  noLotNumber: boolean
  @ApiProperty()
  @Prop()
  lotNumber: string
  @ApiPropertyOptional()
  @Prop()
  postalCode?: string
  @ApiProperty()
  @Prop()
  neighborhood: string
  @ApiProperty()
  @Prop()
  city: string
  @ApiProperty()
  @Prop()
  uf: string
  @ApiProperty()
  @Prop()
  country: string
  @ApiPropertyOptional()
  @Prop()
  lotAmenities: AddressAmenity[]
  @Prop({ idRequired: true })
  createdAt: string
  @Prop({ idRequired: true })
  updatedAt: string
}

export const LotSchema = SchemaFactory.createForClass(Lot)
