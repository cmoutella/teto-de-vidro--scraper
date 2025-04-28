import type { InterfaceAmenity } from '@src/modules/amenity/schemas/models/amenity.interface'

export type PropertyHuntingStage =
  | 'new'
  | 'iniciated'
  | 'returned'
  | 'disappeared'
  | 'unavailable'
  | 'scheduled'
  | 'visited'
  | 'quit'
  | 'submitted'
  | 'approved'
  | 'denied'

export const huntingStageTranslation: {
  [key in PropertyHuntingStage]: string
} = {
  new: 'Novo',
  iniciated: 'Mandei mensagem',
  returned: 'Em contato',
  disappeared: 'Não tive mais notícias',
  scheduled: 'Visita agendada',
  unavailable: 'Indisponível',
  visited: 'Visitado',
  quit: 'Desisti',
  submitted: 'Ficha enviada',
  approved: 'Ficha aprovada',
  denied: 'Ficha negada'
}

export type AddressRelatedFields = Pick<
  InterfaceTargetProperty,
  | 'block'
  | 'city'
  | 'country'
  | 'lotNumber'
  | 'neighborhood'
  | 'noComplement'
  | 'noLotNumber'
  | 'postalCode'
  | 'propertyNumber'
  | 'street'
  | 'uf'
>

export const addressRelatedFields: (keyof AddressRelatedFields)[] = [
  'block',
  'city',
  'country',
  'lotNumber',
  'neighborhood',
  'noComplement',
  'noLotNumber',
  'postalCode',
  'propertyNumber',
  'street',
  'uf'
]

export type AmenityReport = 'user' | 'ad'
export interface TargetAmenity
  extends Omit<
    InterfaceAmenity,
    'id' | 'createdAt' | 'updatedAt' | 'label' | 'amenityOf'
  > {
  relatedId: string
  reportedBy: AmenityReport
  userId?: string
}

export interface InterfaceTargetProperty {
  id?: string

  createdAt: string
  updatedAt: string

  huntId: string
  adURL: string
  nickname?: string
  sellPrice: number
  rentPrice: number
  iptu: number
  priority?: number
  huntingStage: PropertyHuntingStage
  isActive?: boolean
  visitDate?: string

  realState?: string
  realStatePhoneNumber?: string
  contactName?: string
  contactWhatzap?: string

  //general address
  street: string
  neighborhood: string
  postalCode?: string
  city: string
  uf: string
  country: string

  // lot identification
  lotId?: string
  lotName?: string
  noLotNumber: boolean
  lotNumber?: string

  // property identification
  propertyId?: string
  noComplement: boolean
  block?: string
  propertyNumber?: string
  size?: number
  rooms?: number
  bathrooms?: number
  parking?: number

  targetAmenities?: TargetAmenity[]

  // TODO: falta achar um lugar pra colocar isso no front
  is_front?: boolean
  sun?: 'morning' | 'afternoon' | 'none'
  condoPricing?: number
}

export interface CreateTargetProperty
  extends Omit<
    InterfaceTargetProperty,
    'id' | 'lotAmenities' | 'propertyAmenities'
  > {
  lotAmenities: Pick<TargetAmenity, 'relatedId' | 'reportedBy'>
  propertyAmenities: Pick<TargetAmenity, 'relatedId' | 'reportedBy'>
}
