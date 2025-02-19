import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../../address/repositories/property.repository';
import { InterfaceProperty } from '../../address/schemas/models/property.interface';
import { CreateResponse } from 'src/shared/types/creationResponse';
import { LotRepository } from '../repositories/lot.repository';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly lotRepository: LotRepository,
  ) {}

  async createProperty(
    newProperty: InterfaceProperty,
  ): Promise<CreateResponse<InterfaceProperty>> {
    const foundLot = await this.lotRepository.getOneLot(newProperty.lotId);

    if (!foundLot) {
      throw new NotFoundException('o lote informado não existe');
    }

    const foundProperty = await this.propertyRepository.getOnePropertyByAddress(
      newProperty.lotId,
      newProperty.propertyNumber,
    );

    if (!!foundProperty) {
      return { isNew: false, data: foundProperty };
    }

    const data = await this.propertyRepository.createProperty(newProperty);

    if (!data) {
      return null;
    }

    return { isNew: true, data };
  }

  async getAllPropertiesByLotId(
    lotId: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]> {
    return await this.propertyRepository.getAllPropertiesByLotId(
      lotId,
      page,
      limit,
    );
  }

  async getOneProperty(id: string): Promise<InterfaceProperty> {
    const property = await this.propertyRepository.getOnePropertyById(id);

    if (!property) throw new NotFoundException('Imóvel não encontrado');
    return property;
  }

  async updateProperty(
    id: string,
    data: Partial<InterfaceProperty>,
  ): Promise<void> {
    return await this.propertyRepository.updateProperty(id, data);
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyRepository.deleteProperty(id);
  }
}
