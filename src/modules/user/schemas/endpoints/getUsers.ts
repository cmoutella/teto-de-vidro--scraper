import { Prop, Schema } from '@nestjs/mongoose';
import { PublicUserSchema } from '../user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class GetAllUsersSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
  @ApiProperty({ isArray: true })
  @Prop()
  data: PublicUserSchema;
}
