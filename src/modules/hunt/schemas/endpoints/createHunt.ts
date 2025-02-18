import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Hunt } from '../hunt.schema';

@Schema()
export class CreateHuntSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
  @ApiProperty()
  @Prop()
  data: Hunt;
}
