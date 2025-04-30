import type {
  InterfaceTargetProperty,
  TargetAmenity
} from '../../schemas/models/target-property.interface'

export const huntID = 'hunt123'
export const lotId = 'lot-123'
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

export const amenity1: TargetAmenity = { id: 'elevator', reportedBy: 'ad' }
export const amenity2: TargetAmenity = {
  id: 'garden',
  reportedBy: 'user',
  userId: 'user-123'
}
export const manyAmenities = [amenity1, amenity2]
