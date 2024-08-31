import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../../address/repositories/property.repository';
import { InterfaceProperty } from '../../address/schemas/models/property.interface';

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async createProperty(
    newProperty: InterfaceProperty,
  ): Promise<InterfaceProperty> {
    return await this.propertyRepository.createProperty(newProperty);
  }

  async getAllProperties(
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]> {
    return await this.propertyRepository.getAllProperties(page, limit);
  }

  async getAllPropertiesByMainAddress(
    mainAddressId: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]> {
    return await this.propertyRepository.getAllPropertiesByMainAddress(
      mainAddressId,
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
