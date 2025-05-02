import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginatedData } from 'src/shared/types/response'

import { PropertyRepository } from '../../address/repositories/property.repository'
import { InterfaceProperty } from '../../address/schemas/models/property.interface'
import { LotRepository } from '../repositories/lot.repository'

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly lotRepository: LotRepository
  ) {}

  async createProperty(
    newProperty: InterfaceProperty
  ): Promise<InterfaceProperty> {
    const foundLot = await this.lotRepository.getOneLot(newProperty.lotId)

    if (!foundLot) {
      throw new NotFoundException('o lote informado não existe')
    }

    const foundProperty = await this.propertyRepository.getOnePropertyByAddress(
      newProperty.lotId,
      {
        noComplement: newProperty.noComplement,
        block: newProperty.block,
        propertyNumber: newProperty.propertyNumber
      }
    )

    if (foundProperty) {
      return foundProperty
    }

    const data = await this.propertyRepository.createProperty({
      ...newProperty,
      propertyAmenities: []
    })

    if (!data) {
      return null
    }

    return data
  }

  async getAllPropertiesByLotId(
    lotId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceProperty>> {
    return await this.propertyRepository.getAllPropertiesByLotId(
      lotId,
      page,
      limit
    )
  }

  async getOneProperty(id: string): Promise<InterfaceProperty> {
    const property = await this.propertyRepository.getOnePropertyById(id)

    if (!property) throw new NotFoundException('Imóvel não encontrado')
    return property
  }

  async updateProperty(
    id: string,
    data: Partial<InterfaceProperty>
  ): Promise<InterfaceProperty> {
    return await this.propertyRepository.updateProperty(id, data)
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyRepository.deleteProperty(id)
  }
}
