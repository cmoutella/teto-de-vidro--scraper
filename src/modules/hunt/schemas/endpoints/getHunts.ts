import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { Hunt } from '../hunt.schema'

@Schema()
export class FindHuntByIdSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number
  @ApiProperty()
  @Prop()
  data: Hunt
}

@Schema()
export class FindHuntsByIdUserSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number
  @ApiProperty({ isArray: true })
  @Prop()
  data: Hunt
}
