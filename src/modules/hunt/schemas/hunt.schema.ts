import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceHunt } from './models/hunt.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export type HuntDocument = HydratedDocument<Hunt>;

@Schema()
export class Hunt implements InterfaceHunt {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @ApiProperty()
  @Prop()
  title: string;
  @ApiProperty()
  @Prop()
  type: 'buy' | 'rent' | 'either';
  @ApiProperty()
  @Prop()
  creatorId: string;
  @ApiPropertyOptional()
  @Prop()
  minBudget?: number;
  @ApiPropertyOptional()
  @Prop()
  maxBudget?: number;
  @ApiProperty({ isArray: true, example: '[string, string, string]' })
  @Prop()
  targets: string[];
  @ApiProperty({ isArray: true, example: '[string, string, string]' })
  @Prop()
  invitedUsers?: string[];
  @ApiProperty()
  @Prop()
  isActive: boolean;
  @ApiPropertyOptional()
  @Prop()
  movingExpected?: string;
  @ApiPropertyOptional()
  @Prop()
  livingPeople?: number;
  @ApiProperty()
  @Prop()
  livingPets?: number;
}

export const HuntSchema = SchemaFactory.createForClass(Hunt);
