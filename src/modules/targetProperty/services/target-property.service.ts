import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TargetPropertyRepository } from '../repositories/target-property.repository';
import { InterfaceTargetProperty } from '../schemas/models/target-property.interface';

@Injectable()
export class TargetPropertyService {
  constructor(
    private readonly targetPropertyRepository: TargetPropertyRepository,
  ) {}

  async createTargetProperty(
    newProperty: InterfaceTargetProperty,
  ): Promise<InterfaceTargetProperty> {
    if (!newProperty.huntId) {
      throw new BadRequestException(
        'Um imóvel de interesse deve estar associado a uma busca',
      );
    }

    return await this.targetPropertyRepository.createTargetProperty(
      newProperty,
    );
  }

  async getAllTargetsByHunt(
    lotId: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceTargetProperty[]> {
    return await this.targetPropertyRepository.getAllTargetsByHunt(
      lotId,
      page,
      limit,
    );
  }

  async getOneTargetById(id: string): Promise<InterfaceTargetProperty> {
    const property = await this.targetPropertyRepository.getOneTargetById(id);

    if (!property) throw new NotFoundException('Imóvel não encontrado');
    return property;
  }

  async updateTargetProperty(
    id: string,
    data: Partial<InterfaceTargetProperty>,
  ): Promise<void> {
    return await this.targetPropertyRepository.updateTargetProperty(id, data);
  }

  async deleteTargetProperty(id: string): Promise<void> {
    await this.targetPropertyRepository.deleteTargetProperty(id);
  }
}
