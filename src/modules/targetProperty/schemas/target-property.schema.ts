import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  InterfaceTargetProperty,
  PropertyHuntingStage,
} from './models/target-property.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type PropertyDocument = HydratedDocument<TargetProperty>;

@Schema()
export class TargetProperty implements InterfaceTargetProperty {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  // básicos de um target
  @ApiProperty()
  @Prop()
  huntId: string;
  @ApiProperty()
  @Prop()
  adURL: string;
  @ApiProperty()
  @Prop()
  nickname: string;
  @ApiProperty()
  @Prop()
  price: number;
  @ApiProperty()
  @Prop()
  iptu: number;
  @ApiProperty()
  @Prop()
  priority: number;
  @ApiProperty()
  @Prop()
  huntingStage: PropertyHuntingStage;
  @ApiProperty()
  @Prop()
  isActive: boolean;
  @ApiPropertyOptional()
  @Prop()
  visitDate?: string;
  @ApiPropertyOptional()
  @Prop()
  realtor?: string;
  @ApiPropertyOptional()
  @Prop()
  realtorContact?: string;

  // para vincular ou criar um endereço
  // lot
  @ApiPropertyOptional()
  @Prop()
  lotId?: string;
  @Prop()
  address: string;
  @ApiPropertyOptional()
  @Prop()
  lotNumber?: string;
  @ApiPropertyOptional()
  @Prop()
  postalCode?: string;
  @ApiProperty()
  @Prop()
  neighborhood: string;
  @ApiProperty()
  @Prop()
  uf: string;
  @ApiProperty()
  @Prop()
  city: string;
  @ApiProperty()
  @Prop()
  country: string;

  // property
  @ApiPropertyOptional()
  @Prop()
  propertyId?: string;
  @ApiPropertyOptional()
  @Prop()
  block?: string;
  @ApiPropertyOptional()
  @Prop()
  number?: string;
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
  condoPricing?: number;
  @ApiPropertyOptional()
  @Prop()
  convenience?: string;
}

export const TargetPropertySchema =
  SchemaFactory.createForClass(TargetProperty);
