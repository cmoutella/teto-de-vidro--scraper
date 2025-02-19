import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceProperty } from './models/property.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property implements InterfaceProperty {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @ApiProperty()
  @Prop()
  mainAddressId: string;
  @ApiPropertyOptional()
  @Prop()
  block?: string;
  @ApiProperty()
  @Prop()
  propertyNumber: string;
  @ApiPropertyOptional()
  @Prop()
  size?: number;
  @ApiPropertyOptional()
  @Prop()
  rooms?: number;
  @ApiPropertyOptional()
  @Prop()
  bathrooms?: number;
  @ApiPropertyOptional()
  @Prop()
  parking?: number;
  @ApiPropertyOptional()
  @Prop()
  is_front?: boolean;
  @ApiPropertyOptional()
  @Prop()
  sun?: 'morning' | 'afternoon' | 'none';
  @ApiPropertyOptional()
  @Prop()
  condoPricing: number;
  @ApiPropertyOptional()
  @Prop()
  propertyConvenience: string[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);
