import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceLot } from './models/lot.interface';

export type LotDocument = HydratedDocument<Lot>;

@Schema()
export class Lot implements InterfaceLot {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  lotName: string;
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
}

export const LotSchema = SchemaFactory.createForClass(Lot);
