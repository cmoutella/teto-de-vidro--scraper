import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'

import { AmenityOf, InterfaceAmenity } from './models/amenity.interface'

export type PropertyDocument = HydratedDocument<Amenity>

@Schema()
export class Amenity implements InterfaceAmenity {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string

  @ApiProperty()
  @Prop()
  label: string

  @ApiPropertyOptional()
  @Prop()
  amenityOf: AmenityOf

  @ApiPropertyOptional()
  @Prop()
  createdAt: string
  @ApiPropertyOptional()
  @Prop()
  updatedAt: string
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity)
