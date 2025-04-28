import type { InterfaceLot } from './lot.interface'
import type { InterfaceProperty } from './property.interface'

export interface InterfaceAddress
  extends Omit<
      InterfaceProperty,
      'id' | 'lotId' | 'createdAt' | 'updatedAt' | 'propertyAmenities'
    >,
    Omit<InterfaceLot, 'id' | 'createdAt' | 'updatedAt' | 'lotAmenities'> {}

export interface InterfaceSearchAddress {
  street: string
  city: string
  neighborhood: string
  country: string
  block?: string
  lotName?: string
  noLotNumber?: boolean
  lotNumber?: string
  postalCode?: string
  uf?: string
  propertyNumber?: string
}

export interface CreatedAddressFromTarget {
  lot: InterfaceLot
  property?: InterfaceProperty
}
