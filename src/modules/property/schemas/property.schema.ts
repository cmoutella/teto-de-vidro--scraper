import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceProperty } from './models/property.interface';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property implements InterfaceProperty {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  mainAddressId: string;
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

export const PropertySchema = SchemaFactory.createForClass(Property);
