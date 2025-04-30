export type AmenityOf = 'lot' | 'property'

export interface InterfaceAmenity {
  identifier: string
  label: string
  amenityOf?: AmenityOf
  createdAt: string
  updatedAt: string
}

export type SearchAmenity = Record<string, string> &
  Pick<InterfaceAmenity, 'identifier'>
