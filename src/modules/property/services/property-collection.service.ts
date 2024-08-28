import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../repositories/property.repository';
import { InterfaceProperty } from '../schemas/models/property.interface';

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async createProperty(newProperty: InterfaceProperty): Promise<void> {
    return await this.propertyRepository.createProperty(newProperty);
  }

  async getAllProperties(
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]> {
    return await this.propertyRepository.getAllProperties(page, limit);
  }

  async getAllPropertiesByAddress(
    address: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]> {
    return await this.propertyRepository.getAllPropertiesByAddress(
      address,
      page,
      limit,
    );
  }

  async getOneProperty(id: string): Promise<InterfaceProperty> {
    const property = await this.propertyRepository.getOneProperty(id);

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
