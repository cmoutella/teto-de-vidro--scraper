import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceHunt } from './models/hunt.interface';
export type HuntDocument = HydratedDocument<Hunt>;

@Schema()
export class Hunt implements InterfaceHunt {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  title: string;
  @Prop()
  type: 'buy' | 'rent' | 'either';
  @Prop()
  creatorId: string;
  @Prop()
  minBudget?: number;
  @Prop()
  maxBudget?: number;
  @Prop()
  targets: string[];
  @Prop()
  invitedUsers?: string[];
  @Prop()
  isActive: boolean;
  @Prop()
  movingExpected?: string;
  @Prop()
  livingPeople?: number;
  @Prop()
  livingPets?: number;
}

export const HuntSchema = SchemaFactory.createForClass(Hunt);
