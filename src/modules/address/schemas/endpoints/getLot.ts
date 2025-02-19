import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Lot } from '../lot.schema';

@Schema()
export class GetLotsByIdSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
  @ApiProperty()
  @Prop()
  data: Lot;
}

@Schema()
export class GetLotsByCEPSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
  @ApiProperty({ isArray: true })
  @Prop()
  data: Lot[];
}
