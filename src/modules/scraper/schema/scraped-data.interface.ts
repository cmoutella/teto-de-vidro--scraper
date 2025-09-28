export interface AdScrapedData
  extends Record<
    string,
    string | string[] | number | undefined | Record<string, boolean>
  > {
  rentPrice?: number
  sellPrice?: number
  condoPricing?: number
  iptu?: number
  size?: number
  rooms?: number
  bathrooms?: number
  parkingSpots?: number
  floorLevel?: number
  suites?: number
  street?: string
  lotNumber?: string
  neighborhood?: string
  city?: string
  uf?: string
  amenities?: Record<string, boolean>
}
