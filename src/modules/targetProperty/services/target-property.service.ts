import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common'
import { InterfaceLot } from 'src/modules/address/schemas/models/lot.interface'
import { InterfaceProperty } from 'src/modules/address/schemas/models/property.interface'
import { AddressService } from 'src/modules/address/services/address.service'
import { HuntRepository } from 'src/modules/hunt/repositories/hunt.repository'
import { PaginatedData } from 'src/shared/types/response'

import { TargetPropertyRepository } from '../repositories/target-property.repository'
import { InterfaceTargetProperty } from '../schemas/models/target-property.interface'

@Injectable()
export class TargetPropertyService {
  constructor(
    private readonly targetPropertyRepository: TargetPropertyRepository,
    @Inject(forwardRef(() => HuntRepository))
    private readonly huntRepository: HuntRepository,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService
  ) {}

  async createTargetProperty(
    newProperty: InterfaceTargetProperty
  ): Promise<InterfaceTargetProperty | undefined> {
    if (!newProperty.huntId) {
      return undefined
    }

    const address = await this.addressService.createAddress({
      ...newProperty,
      noComplement: false,
      noLotNumber: false
    })

    let relatedLot: Omit<InterfaceLot, 'id' | 'createdAt' | 'updatedAt'>
    let relatedProperty: Omit<
      InterfaceProperty,
      'id' | 'createdAt' | 'updatedAt' | 'lotId'
    >
    if (address) {
      if (address.lot) {
        const { id, createdAt, updatedAt, ...relatedData } = address.lot
        relatedLot = relatedData
      }

      if (address.property) {
        const { id, lotId, createdAt, updatedAt, ...relatedData } =
          address.property
        relatedProperty = relatedData
      }
    }

    return await this.targetPropertyRepository.createTargetProperty({
      ...newProperty,
      ...(address?.lot ? { lotId: address.lot.id } : {}),
      ...(relatedLot ? relatedLot : {}),
      ...(address?.property ? { propertyId: address.property.id } : {}),
      ...(relatedProperty ? relatedProperty : {}),
      isActive: true
    })
  }

  async preventDuplicity(targetToValidate: InterfaceTargetProperty) {
    // TODO: lidar com o noLotNumber e noComplement
    if (targetToValidate.propertyNumber && targetToValidate.lotNumber) {
      const alreadyCreated =
        await this.targetPropertyRepository.getHuntTargetByFullAddress(
          targetToValidate.huntId,
          {
            propertyNumber: targetToValidate.propertyNumber,
            lotNumber: targetToValidate.lotNumber,
            street: targetToValidate.street,
            neighborhood: targetToValidate.neighborhood,
            city: targetToValidate.city,
            uf: targetToValidate.uf,
            country: targetToValidate.country
          }
        )

      if (alreadyCreated) {
        throw new ConflictException({
          message: 'ALREADY_EXISTS'
        })
      }
    } else if (targetToValidate.lotNumber && !targetToValidate.propertyNumber) {
      const hasTargets =
        await this.targetPropertyRepository.getHuntTargetsByLot(
          targetToValidate.huntId,
          {
            lotNumber: targetToValidate.lotNumber,
            street: targetToValidate.street,
            neighborhood: targetToValidate.neighborhood,
            city: targetToValidate.city,
            uf: targetToValidate.uf,
            country: targetToValidate.country
          }
        )

      if (hasTargets) {
        throw new ConflictException({
          message: 'DUPLICITY_WARNING: byLot'
        })
      }
    } else {
      const hasTargets =
        await this.targetPropertyRepository.getHuntTargetsByStreet(
          targetToValidate.huntId,
          {
            street: targetToValidate.street,
            neighborhood: targetToValidate.neighborhood,
            city: targetToValidate.city,
            uf: targetToValidate.uf,
            country: targetToValidate.country
          }
        )

      if (hasTargets) {
        throw new ConflictException({
          message: 'DUPLICITY_WARNING: byStreet'
        })
      }
    }

    return true
  }

  async getAllTargetsByHunt(
    huntId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceTargetProperty> | undefined> {
    if (!huntId) {
      return undefined
    }

    return await this.targetPropertyRepository.getAllTargetsByHunt(
      huntId,
      page,
      limit
    )
  }

  async getOneTargetById(
    id: string
  ): Promise<InterfaceTargetProperty | undefined> {
    if (!id) {
      return undefined
    }

    const property = await this.targetPropertyRepository.getOneTargetById(id)
    return property
  }

  async updateTargetProperty(
    id: string,
    data: InterfaceTargetProperty
  ): Promise<InterfaceTargetProperty> {
    if (!id) {
      return null
    }
    // cria ou retorna o endereço
    const address = await this.addressService.createAddress({
      ...data,
      noComplement: false,
      noLotNumber: false
    })

    let relatedLot: Omit<InterfaceLot, 'id' | 'createdAt' | 'updatedAt'>
    let relatedProperty: Omit<
      InterfaceProperty,
      'id' | 'createdAt' | 'updatedAt' | 'lotId'
    >
    if (address) {
      if (address.lot) {
        const { id, createdAt, updatedAt, ...relatedData } = address.lot
        relatedLot = relatedData
      }

      if (address.property) {
        const { id, lotId, createdAt, updatedAt, ...relatedData } =
          address.property
        relatedProperty = relatedData
      }
    }

    return await this.targetPropertyRepository.updateTargetProperty(id, {
      ...data,
      ...(address?.lot ? { lotId: address.lot.id } : {}),
      ...(relatedLot ? relatedLot : {}),
      ...(address?.property ? { propertyId: address.property.id } : {}),
      ...(relatedProperty ? relatedProperty : {}),
      isActive: true
    })

    // TODO: log
    // TODO: quando o lotId ou o propertyId são atualizados
    // deveria atualizar a referencia em todos os comentários?
    // provavelmente fazer isso através de uma fila
  }

  async deleteTargetProperty(id: string): Promise<boolean> {
    if (!id) {
      return false
    }

    try {
      await this.targetPropertyRepository.deleteTargetProperty(id)

      return true
    } catch (_err) {
      return false
    }
  }
}
