import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { TargetProperty } from '../target-property.schema'

@Schema()
export class GetOneTargetPropertySuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number
  @ApiProperty()
  @Prop()
  data: TargetProperty
}

@Schema()
export class GetTargetPropertiesByHuntSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number
  @ApiProperty({ isArray: true })
  @Prop()
  data: TargetProperty
}
