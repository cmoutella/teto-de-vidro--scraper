import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common'
import { AddressService } from 'src/modules/address/services/address.service'
import { PaginatedData } from 'src/shared/types/response'

import { TargetPropertyRepository } from '../repositories/target-property.repository'
import {
  InterfaceTargetProperty,
  TargetAmenity
} from '../schemas/models/target-property.interface'

@Injectable()
export class TargetPropertyService {
  constructor(
    private readonly targetPropertyRepository: TargetPropertyRepository,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService
  ) {}

  async createTargetProperty(
    newProperty: InterfaceTargetProperty
  ): Promise<InterfaceTargetProperty | undefined> {
    if (!newProperty.huntId) {
      return undefined
    }

    const address = await this.addressService.createAddress(newProperty)

    const created = await this.targetPropertyRepository.createTargetProperty({
      ...newProperty,
      ...(address?.lot ? { lotId: address.lot.id } : {}),
      ...(address?.property ? { propertyId: address.property.id } : {}),
      isActive: true
    })

    // TODO: atualizar lot e property com as respectivas amenities

    return created
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
      ...data
    })

    return await this.targetPropertyRepository.updateTargetProperty(id, {
      ...data,
      ...(address?.lot ? { lotId: address.lot.id } : {}),
      ...(address?.property ? { propertyId: address.property.id } : {}),
      isActive: true
    })

    //TODO:
    // fazer o update de lotAmenities e propertyAmenities

    // TODO: log
    // TODO: quando o lotId ou o propertyId são atualizados
    // deveria atualizar a referencia em todos os comentários?
    // provavelmente fazer isso através de uma fila
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

  async addAmenityToTarget(
    targetId: string,
    amenity: TargetAmenity
  ): Promise<boolean> {
    if (!targetId) return undefined

    const existingTarget = await this.getOneTargetById(targetId)

    if (!existingTarget) return false

    const existingAmenities = existingTarget.targetAmenities ?? []

    const targetAmenitiesUpdated = [...existingAmenities, amenity]

    try {
      await this.updateTargetProperty(targetId, {
        ...existingTarget,
        targetAmenities: targetAmenitiesUpdated
      })

      return true
    } catch {
      return false
    }
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
