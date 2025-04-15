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
  lotId: string;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  block?: string;
  @ApiProperty()
  @Prop()
  propertyNumber: string;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  size?: number;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  rooms?: number;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  bathrooms?: number;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  parking?: number;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  is_front?: boolean;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  sun?: 'morning' | 'afternoon' | 'none';
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  condoPricing?: number;
  @ApiPropertyOptional()
  @Prop({ isRequired: false })
  propertyConvenience?: string[];
  @Prop({ idRequired: true })
  createdAt: string;
  @Prop({ idRequired: true })
  updatedAt: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
