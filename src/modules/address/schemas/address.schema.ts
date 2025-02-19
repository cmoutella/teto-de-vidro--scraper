import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  InterfaceAddress,
  InterfaceSearchAddress,
} from './models/address.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type PropertyDocument = HydratedDocument<Address>;

@Schema()
export class Address implements InterfaceAddress {
  @ApiProperty()
  @Prop()
  street: string;
  @ApiPropertyOptional()
  @Prop()
  lotNumber: string;
  @ApiProperty()
  @Prop()
  postalCode: string;
  @ApiProperty()
  @Prop()
  neighborhood: string;
  @ApiProperty()
  @Prop()
  city: string;
  @ApiProperty()
  @Prop()
  province: string;
  @ApiProperty()
  @Prop()
  country: string;
  @ApiProperty()
  @Prop()
  lotConvenience: string[];
  @ApiPropertyOptional()
  @Prop()
  block?: string;
  @ApiPropertyOptional()
  @Prop()
  propertyNumber: string;
  @ApiPropertyOptional()
  @Prop()
  size: number;
  @ApiPropertyOptional()
  @Prop()
  rooms: number;
  @ApiPropertyOptional()
  @Prop()
  bathrooms: number;
  @ApiPropertyOptional()
  @Prop()
  parking: number;
  @ApiPropertyOptional()
  @Prop()
  is_front: boolean;
  @ApiPropertyOptional()
  @Prop()
  sun: 'morning' | 'afternoon' | 'none';
  @ApiPropertyOptional()
  @Prop()
  condoPricing: number;
  @ApiPropertyOptional()
  @Prop()
  propertyConvenience: string[];
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class SearchAddress implements InterfaceSearchAddress {
  @Prop()
  street: string;
  @Prop()
  lotNumber: string;
  @Prop()
  postalCode: string;
  @Prop()
  neighborhood: string;
  @Prop()
  city: string;
  @Prop()
  province: string;
  @Prop()
  country: string;
  @Prop()
  lotConvenience: string[];
  @Prop()
  block: string;
  @Prop()
  propertyNumber: string;
}
