import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceUser } from './models/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements InterfaceUser {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @ApiProperty()
  @Prop()
  nickName: string;
  @ApiProperty()
  @Prop()
  name: string;
  @ApiProperty()
  @Prop()
  password: string;
  @ApiProperty()
  @Prop()
  profession: string;
  @ApiProperty()
  @Prop()
  gender: 'male' | 'female' | 'neutral';
  @ApiProperty()
  @Prop()
  birthDate: string;
  @ApiProperty()
  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class PublicUserSchema {
  @ApiProperty()
  @Prop()
  id: string;
  @ApiProperty()
  @Prop()
  nickName: string;
  @ApiProperty()
  @Prop()
  name: string;
  @ApiProperty()
  @Prop()
  profession: string;
  @ApiProperty()
  @Prop()
  gender: string;
  @ApiProperty()
  @Prop()
  birthDate: string;
  @ApiProperty()
  @Prop()
  email: string;
}
