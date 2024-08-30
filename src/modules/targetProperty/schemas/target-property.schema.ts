import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  InterfaceTargetProperty,
  PropertyHuntingStage,
} from './models/target-property.interface';

export type PropertyDocument = HydratedDocument<TargetProperty>;

@Schema()
export class TargetProperty implements InterfaceTargetProperty {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;

  @Prop()
  huntId: string;
  @Prop()
  adURL: string;
  @Prop()
  nickname: string;
  @Prop()
  price: number;
  @Prop()
  tax: number;
  @Prop()
  priority: number;
  @Prop()
  huntingStage: PropertyHuntingStage;
  @Prop()
  isActive: boolean;
  @Prop()
  visitDate: string;
  @Prop()
  realtor: string;
  @Prop()
  realtorContact: string;

  @Prop()
  mainAddressId: string;
  @Prop()
  propertyId: string;
  @Prop()
  address: string;
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
  lotConvenience: string;
  @Prop()
  block: string;
  @Prop()
  number: string;
  @Prop()
  size: number;
  @Prop()
  rooms: number;
  @Prop()
  bathrooms: number;
  @Prop()
  parking: number;
  @Prop()
  is_front: boolean;
  @Prop()
  sun: 'morning' | 'afternoon' | 'none';
  @Prop()
  condoPricing: number;
  @Prop()
  convenience: string;
}

export const TargetPropertySchema =
  SchemaFactory.createForClass(TargetProperty);
