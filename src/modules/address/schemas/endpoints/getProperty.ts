import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../property.schema';

@Schema()
export class GetPropertyByIdSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
  @ApiProperty()
  @Prop()
  data: Property;
}

@Schema()
export class GetPropertyByLotSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number;
  @ApiProperty({ isArray: true })
  @Prop()
  data: Property;
}
