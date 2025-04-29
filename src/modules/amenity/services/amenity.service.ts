import { Injectable, NotFoundException } from '@nestjs/common'

import { AmenityRepository } from '../repositories/amenity.repository'
import { InterfaceAmenity } from '../schemas/models/amenity.interface'

@Injectable()
export class AmenityService {
  constructor(private readonly amenityRepository: AmenityRepository) {}

  async createAmenity(newAmenity: InterfaceAmenity): Promise<InterfaceAmenity> {
    const createdAmenity =
      await this.amenityRepository.createAmenity(newAmenity)

    return createdAmenity
  }

  async createManyAmenities(
    amenities: Pick<InterfaceAmenity, 'id'>[]
  ): Promise<{
    success: string[]
    failed: { data: string; error?: string }[]
  } | null> {
    const createdAmenity =
      await this.amenityRepository.createManyAmenities(amenities)

    return createdAmenity
  }

  async getOneAmenityById(id: string): Promise<InterfaceAmenity> {
    if (!id) return undefined

    const amenity = await this.amenityRepository.getOneAmenityById(id)

    if (!amenity) throw new NotFoundException('Endereço não encontrado')
    return amenity
  }

  async getOneAmenityByLabel(label: string): Promise<InterfaceAmenity> {
    const amenity = await this.amenityRepository.getOneAmenityByLabel(label)

    if (!amenity) throw new NotFoundException('Endereço não encontrado')
    return amenity
  }

  // TODO: async getCompleteData()

  async updateAmenity(
    id: string,
    data: Partial<InterfaceAmenity>
  ): Promise<InterfaceAmenity> {
    return await this.amenityRepository.updateAmenity(id, data)
  }

  async deleteAmenity(id: string): Promise<boolean> {
    if (!id) {
      return false
    }

    try {
      await this.amenityRepository.deleteAmenity(id)

      return true
    } catch {
      return false
    }
  }
}
