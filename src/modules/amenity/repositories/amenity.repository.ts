import type { InterfaceAmenity } from '../schemas/models/amenity.interface'

export abstract class AmenityRepository {
  abstract getOneAmenityById(id: string): Promise<InterfaceAmenity>

  abstract getOneAmenityByLabel(label: string): Promise<InterfaceAmenity>

  abstract createAmenity(
    newLot: InterfaceAmenity
  ): Promise<InterfaceAmenity | null>

  abstract updateAmenity(
    id: string,
    data: Partial<InterfaceAmenity>
  ): Promise<InterfaceAmenity>

  abstract deleteAmenity(id: string): Promise<void>
}
