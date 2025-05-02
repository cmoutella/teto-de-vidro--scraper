import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'

import { AmenityOf, InterfaceAmenity } from './models/amenity.interface'

export type PropertyDocument = HydratedDocument<Amenity>

@Schema()
export class Amenity implements InterfaceAmenity {
  @ApiProperty()
  @Prop()
  identifier: string

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
