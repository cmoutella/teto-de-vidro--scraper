import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { Property } from '../property.schema'

@Schema()
export class CreatePropertySuccess {
  @ApiProperty({ default: 201 })
  @Prop()
  status: number
  @ApiProperty()
  @Prop()
  data: Property
}
