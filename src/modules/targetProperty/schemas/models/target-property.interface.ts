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

// TODO connect to Lot in address
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
  realtor?: string
  realtorContact?: string

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
  lotConvenience?: string[]

  // property identification
  propertyId?: string
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
  propertyConvenience?: string[]
}
