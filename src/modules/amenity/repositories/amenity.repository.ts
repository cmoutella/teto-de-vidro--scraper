import type { InterfaceAmenity } from '../schemas/models/amenity.interface'

export abstract class AmenityRepository {
  abstract getOneAmenityById(id: string): Promise<InterfaceAmenity>

  abstract getOneAmenityByLabel(label: string): Promise<InterfaceAmenity>

  abstract createAmenity(
    newAmenity: InterfaceAmenity
  ): Promise<InterfaceAmenity | null>

  abstract createManyAmenities(
    amenities: Pick<InterfaceAmenity, 'identifier'>[]
  ): Promise<{
    success: string[]
    failed: { data: string; error?: string }[]
  } | null>

  abstract updateAmenity(
    id: string,
    data: Partial<InterfaceAmenity>
  ): Promise<InterfaceAmenity>

  abstract deleteAmenity(id: string): Promise<void>
}
