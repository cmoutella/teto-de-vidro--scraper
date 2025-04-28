import type { AddressAmenity } from './shared/shared.interface'
export interface InterfaceProperty {
  id?: string
  lotId: string
  noComplement: boolean
  block?: string
  propertyNumber?: string
  size?: number
  rooms?: number
  bathrooms?: number
  parking?: number
  is_front?: boolean
  sun?: 'morning' | 'afternoon' | 'none'
  condoPricing?: number
  propertyAmenities?: AddressAmenity[]
  createdAt: string
  updatedAt: string
}
