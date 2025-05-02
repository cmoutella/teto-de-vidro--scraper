import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'

import {
  InterfaceAddress,
  InterfaceSearchAddress
} from './models/address.interface'

export type PropertyDocument = HydratedDocument<Address>

@Schema()
export class Address implements InterfaceAddress {
  // related to Lot
  @ApiProperty()
  @Prop()
  street: string
  @ApiProperty()
  @Prop()
  noLotNumber: boolean
  @ApiPropertyOptional()
  @Prop()
  lotNumber: string
  @ApiProperty()
  @Prop()
  postalCode: string
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

  // related to property
  @ApiProperty()
  @Prop()
  noComplement: boolean
  @ApiPropertyOptional()
  @Prop()
  block?: string
  @ApiPropertyOptional()
  @Prop()
  propertyNumber: string
  @ApiPropertyOptional()
  @Prop()
  size: number
  @ApiPropertyOptional()
  @Prop()
  rooms: number
  @ApiPropertyOptional()
  @Prop()
  bathrooms: number
  @ApiPropertyOptional()
  @Prop()
  parking: number
  @ApiPropertyOptional()
  @Prop()
  is_front: boolean
  @ApiPropertyOptional()
  @Prop()
  sun: 'morning' | 'afternoon' | 'none'
  @ApiPropertyOptional()
  @Prop()
  condoPricing: number
}

export const AddressSchema = SchemaFactory.createForClass(Address)

@Schema()
export class SearchAddress implements InterfaceSearchAddress {
  @ApiProperty()
  @Prop()
  street: string
  @ApiProperty()
  @Prop()
  lotNumber: string
  @ApiProperty()
  @Prop()
  postalCode: string
  @ApiProperty()
  @Prop()
  neighborhood: string
  @ApiProperty()
  @Prop()
  city: string
  @ApiProperty()
  @Prop()
  country: string
  @ApiProperty()
  @Prop()
  lotAmenities: string[]
  @ApiProperty()
  @Prop()
  block: string
  @ApiProperty()
  @Prop()
  propertyNumber: string
}
