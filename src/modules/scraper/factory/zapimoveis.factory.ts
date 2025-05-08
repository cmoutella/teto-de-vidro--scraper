import type { AdScrapedData } from '../schema/scraped-data.interface'

interface ZapImoveisScrapedData
  extends Record<string, string | string[] | number | boolean | undefined> {
  rentPrice?: number
  condoPricing?: number
  iptu?: number
  floorSize?: number
  numberOfRooms?: number
  numberOfBathroomsTotal?: number
  numberOfParkingSpaces?: number
  floorLevel?: number
  numberOfSuites?: number
  street?: string
  lotNumber?: string
  neighborhood?: string
  city?: string
  uf?: string
}

export function sanitizeZap(data: ZapImoveisScrapedData) {
  const {
    floorSize,
    numberOfRooms,
    numberOfBathroomsTotal,
    numberOfParkingSpaces,
    numberOfSuites,
    ...other
  } = data

  const amenities: Record<string, boolean> = {}
  const rest: Record<string, string | string[] | number> = {}

  for (const key in other) {
    if (typeof other[key] === 'boolean') {
      amenities[key] = true
    } else {
      rest[key] = other[key] as string | string[] | number
    }
  }

  const sanitized: AdScrapedData = {
    size: floorSize,
    rooms: numberOfRooms,
    bathrooms: numberOfBathroomsTotal,
    parkingSpots: numberOfParkingSpaces,
    suites: numberOfSuites,
    amenities: amenities,
    ...rest
  }

  return sanitized
}
