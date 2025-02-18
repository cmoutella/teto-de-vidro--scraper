import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class DeleteHuntSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
}
