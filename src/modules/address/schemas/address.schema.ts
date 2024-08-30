import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InterfaceAddress } from './models/address.interface';

export type PropertyDocument = HydratedDocument<Address>;

@Schema()
export class Address implements InterfaceAddress {
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

export const AddressSchema = SchemaFactory.createForClass(Address);
