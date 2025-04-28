export type AmenityOf = 'lot' | 'property'

export interface InterfaceAmenity {
  id: string
  label: string
  amenityOf?: AmenityOf
  createdAt: string
  updatedAt: string
}
