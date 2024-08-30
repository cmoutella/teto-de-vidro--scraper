import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceLot } from './models/lot.interface';

export type LotDocument = HydratedDocument<Lot>;

@Schema()
export class Lot implements InterfaceLot {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  street: string;
  @Prop()
  number: string;
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
  convenience: string[];
}

export const LotSchema = SchemaFactory.createForClass(Lot);
