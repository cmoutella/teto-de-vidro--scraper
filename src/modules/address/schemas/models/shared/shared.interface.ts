import type { TargetAmenity } from '@src/modules/targetProperty/schemas/models/target-property.interface'

export interface AddressAmenity extends TargetAmenity {
  targetRelated: string
}
