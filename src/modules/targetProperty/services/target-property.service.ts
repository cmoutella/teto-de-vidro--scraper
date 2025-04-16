import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TargetPropertyRepository } from '../repositories/target-property.repository';
import { InterfaceTargetProperty } from '../schemas/models/target-property.interface';
import { PaginatedData } from 'src/shared/types/response';
import { HuntRepository } from 'src/modules/hunt/repositories/hunt.repository';

@Injectable()
export class TargetPropertyService {
  constructor(
    private readonly targetPropertyRepository: TargetPropertyRepository,
    @Inject(forwardRef(() => HuntRepository))
    private readonly huntRepository: HuntRepository,
  ) {}

  // TODO: tentar criar o endereço
  async createTargetProperty(
    newProperty: InterfaceTargetProperty,
  ): Promise<InterfaceTargetProperty> {
    if (!newProperty.huntId) {
      throw new BadRequestException(
        'Um imóvel de interesse deve estar associado a uma hunt',
      );
    }

    // TODO: lidar com o noLotNumber
    // TODO: lidar com o noPropertyNumber
    if (newProperty.propertyNumber && newProperty.lotNumber) {
      const alreadyCreated =
        await this.targetPropertyRepository.getHuntTargetByFullAddress(
          newProperty.huntId,
          {
            propertyNumber: newProperty.propertyNumber,
            lotNumber: newProperty.lotNumber,
            street: newProperty.street,
            neighborhood: newProperty.neighborhood,
            city: newProperty.city,
            uf: newProperty.uf,
            country: newProperty.country,
          },
        );

      if (alreadyCreated)
        throw new ConflictException({
          message: 'ALREADY_EXISTS',
        });
    } else if (newProperty.lotNumber && !newProperty.propertyNumber) {
      const hasTargets =
        await this.targetPropertyRepository.getHuntTargetsByLot(
          newProperty.huntId,
          {
            lotNumber: newProperty.lotNumber,
            street: newProperty.street,
            neighborhood: newProperty.neighborhood,
            city: newProperty.city,
            uf: newProperty.uf,
            country: newProperty.country,
          },
        );

      if (hasTargets)
        throw new ConflictException({
          message: 'DUPLICITY_WARNING: byLot',
        });
    } else {
      const hasTargets =
        await this.targetPropertyRepository.getHuntTargetsByStreet(
          newProperty.huntId,
          {
            street: newProperty.street,
            neighborhood: newProperty.neighborhood,
            city: newProperty.city,
            uf: newProperty.uf,
            country: newProperty.country,
          },
        );

      if (hasTargets)
        throw new ConflictException({
          message: 'DUPLICITY_WARNING: byStreet',
        });
    }

    return await this.targetPropertyRepository.createTargetProperty({
      ...newProperty,
      isActive: true,
    });
  }

  async getAllTargetsByHunt(
    lotId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedData<InterfaceTargetProperty>> {
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

  // TODO: tentar criar o endereço
  async updateTargetProperty(
    id: string,
    data: Partial<InterfaceTargetProperty>,
  ): Promise<InterfaceTargetProperty> {
    if (data.propertyNumber && data.lotNumber) {
      const alreadyCreated =
        await this.targetPropertyRepository.getHuntTargetByFullAddress(
          data.huntId,
          {
            propertyNumber: data.propertyNumber,
            lotNumber: data.lotNumber,
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            uf: data.uf,
            country: data.country,
          },
        );

      if (alreadyCreated && alreadyCreated.id !== id)
        throw new ConflictException({
          message: 'ALREADY_EXISTS',
        });
    } else if (data.lotNumber && !data.propertyNumber) {
      const hasTargets =
        await this.targetPropertyRepository.getHuntTargetsByLot(data.huntId, {
          lotNumber: data.lotNumber,
          street: data.street,
          neighborhood: data.neighborhood,
          city: data.city,
          uf: data.uf,
          country: data.country,
        });

      const existingTargetNotThisOne =
        hasTargets.length === 1 && hasTargets[0].id !== id;

      if (hasTargets && (hasTargets.length >= 2 || existingTargetNotThisOne))
        throw new ConflictException({
          message: 'DUPLICITY_WARNING: byLot',
        });
    } else {
      const hasTargets =
        await this.targetPropertyRepository.getHuntTargetsByStreet(
          data.huntId,
          {
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            uf: data.uf,
            country: data.country,
          },
        );

      const existingTargetNotThisOne =
        hasTargets.length === 1 && hasTargets[0].id !== id;

      if (hasTargets && existingTargetNotThisOne)
        throw new ConflictException({
          message: 'DUPLICITY_WARNING: byStreet',
        });
    }

    return await this.targetPropertyRepository.updateTargetProperty(id, data);
  }

  async deleteTargetProperty(id: string): Promise<void> {
    const toDelete = await this.targetPropertyRepository.getOneTargetById(id);
    const deleted =
      await this.targetPropertyRepository.deleteTargetProperty(id);

    if (deleted) {
      await this.huntRepository.removeTargetFromHunt(toDelete.huntId, id);
    }
  }
}
