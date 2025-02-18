import { Prop, Schema } from '@nestjs/mongoose';
import { PublicUserSchema } from '../user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class CreateUserSuccess {
  @ApiProperty({ default: 201 })
  @Prop()
  status: number;
  @ApiProperty()
  @Prop()
  data: PublicUserSchema;
}

@Schema()
export class CreateUserFailureException {
  @ApiProperty()
  @Prop()
  status: number;
  @ApiProperty()
  @Prop()
  timestamp: string;
  @ApiProperty()
  @Prop()
  message: string;
  @ApiProperty()
  @Prop()
  path: string;
}
