import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceLot } from './models/lot.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type LotDocument = HydratedDocument<Lot>;

@Schema()
export class Lot implements InterfaceLot {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @ApiPropertyOptional()
  @Prop()
  lotName?: string;
  @ApiProperty()
  @Prop()
  street: string;
  @ApiProperty()
  @Prop()
  lotNumber: string;
  @ApiPropertyOptional()
  @Prop()
  postalCode?: string;
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
  @ApiPropertyOptional()
  @Prop()
  lotConvenience: string[];
}

export const LotSchema = SchemaFactory.createForClass(Lot);
