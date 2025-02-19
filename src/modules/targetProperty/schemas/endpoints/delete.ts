import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class DeleteTargetPropertySuccess {
  @ApiProperty({ default: 201 })
  @Prop()
  status: number;
}
