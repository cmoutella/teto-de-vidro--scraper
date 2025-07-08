import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { AccessLevelPolicies } from '../accessLevelPolicies.schema'

@Schema()
export class PoliciesByLevelSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number
  @ApiProperty()
  @Prop()
  data: AccessLevelPolicies
}
