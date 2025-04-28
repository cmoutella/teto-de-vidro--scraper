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

  async getOneAmenityById(id: string): Promise<InterfaceAmenity> {
    const amenity = await this.amenityRepository.getOneAmenityById(id)

    if (!amenity) throw new NotFoundException('Endereço não encontrado')
    return amenity
  }

  async getOneAmenityByLabel(label: string): Promise<InterfaceAmenity> {
    const amenity = await this.amenityRepository.getOneAmenityByLabel(label)

    if (!amenity) throw new NotFoundException('Endereço não encontrado')
    return amenity
  }

  async updateAmenity(
    id: string,
    data: Partial<InterfaceAmenity>
  ): Promise<InterfaceAmenity> {
    return await this.amenityRepository.updateAmenity(id, data)
  }

  async deleteAmenity(id: string): Promise<void> {
    await this.amenityRepository.deleteAmenity(id)
  }
}
