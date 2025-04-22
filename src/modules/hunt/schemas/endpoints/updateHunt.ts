import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Hunt } from '../hunt.schema'

@Schema()
export class UpdateHuntBody {
  @ApiProperty()
  @Prop()
  id: string
  @ApiPropertyOptional()
  @Prop()
  title: string
  @ApiPropertyOptional()
  @Prop()
  type: 'buy' | 'rent' | 'either'
  @ApiPropertyOptional()
  @Prop()
  minBudget?: number
  @ApiPropertyOptional()
  @Prop()
  maxBudget?: number
  @ApiPropertyOptional({ isArray: true, example: '[string, string, string]' })
  @Prop()
  targets: string[]
  @ApiPropertyOptional({ isArray: true, example: '[string, string, string]' })
  @Prop()
  invitedUsers?: string[]
  @ApiPropertyOptional()
  @Prop()
  isActive: boolean
  @ApiPropertyOptional()
  @Prop()
  movingExpected?: string
  @ApiPropertyOptional()
  @Prop()
  livingPeople?: number
  @ApiPropertyOptional()
  @Prop()
  livingPets?: number
}

@Schema()
export class UpdateHuntSuccess {
  @ApiProperty({ default: 200 })
  @Prop()
  status: number
  @ApiProperty()
  @Prop()
  data: Hunt
}
