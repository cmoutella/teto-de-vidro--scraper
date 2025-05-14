import { Types } from 'mongoose'

import type {
  InterfaceTargetProperty,
  TargetAmenity
} from '../../schemas/models/target-property.interface'

export const huntID = new Types.ObjectId().toHexString()
export const targetId = new Types.ObjectId().toHexString()
export const lotId = new Types.ObjectId().toHexString()
export const propertyId = 'property-123'
export const baseProperty: InterfaceTargetProperty = {
  adURL: '',
  sellPrice: 0,
  rentPrice: 0,
  condoPricing: 0,
  iptu: 0,
  huntId: huntID,
  street: 'Rua A',
  neighborhood: 'Bairro B',
  city: 'Cidade C',
  uf: 'SP',
  country: 'Brasil',
  noLotNumber: false,
  lotNumber: '123',
  noComplement: false,
  propertyNumber: '456',
  isActive: true,
  huntingStage: 'new',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const amenity1: TargetAmenity = {
  identifier: 'elevator',
  reportedBy: 'ad'
}
export const amenity2: TargetAmenity = {
  identifier: 'garden',
  reportedBy: 'user',
  userId: 'user-123'
}
export const manyAmenities = [amenity1, amenity2]
