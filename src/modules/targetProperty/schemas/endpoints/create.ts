import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { TargetProperty } from '../target-property.schema'

@Schema()
export class CreateTargetPropertySuccess {
  @ApiProperty({ default: 201 })
  @Prop()
  status: number
  @ApiProperty()
  @Prop()
  data: TargetProperty
}
