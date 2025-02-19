import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Lot } from '../lot.schema';

@Schema()
export class CreationReturn {
  @ApiProperty()
  @Prop()
  isNew: boolean;
  @ApiProperty()
  @Prop()
  data: Lot;
}

@Schema()
export class CreateLotSuccess {
  @ApiProperty({ default: 201 })
  @Prop()
  status: number;
  @ApiProperty()
  @Prop()
  data: CreationReturn;
}
