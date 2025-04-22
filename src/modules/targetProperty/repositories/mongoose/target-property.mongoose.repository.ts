import { InjectModel } from '@nestjs/mongoose'
import type { DeleteResult } from 'mongodb'
import { Model } from 'mongoose'
import { DEFAULT_LIMIT } from 'src/shared/const/pagination'
import { LeanDoc } from 'src/shared/types/mongoose'
import { PaginatedData } from 'src/shared/types/response'

import { InterfaceTargetProperty } from '../../schemas/models/target-property.interface'
import { TargetProperty } from '../../schemas/target-property.schema'
import { TargetPropertyRepository } from '../target-property.repository'

export class TargetPropertyMongooseRepository
  implements TargetPropertyRepository
{
  constructor(
    @InjectModel(TargetProperty.name)
    private targetPropertyModel: Model<TargetProperty>
  ) {}

  async createTargetProperty(
    newTarget: InterfaceTargetProperty
  ): Promise<TargetProperty> {
    const createProperty = new this.targetPropertyModel(newTarget)

    await createProperty.save()

    if (!createProperty) return null

    const created = await this.targetPropertyModel
      .findById(createProperty._id)
      .lean<LeanDoc<TargetProperty>>()
      .exec()

    const { _id: id, __v, ...otherData } = created

    return { id: id.toString(), ...otherData }
  }

  async getAllTargetsByHunt(
    huntId: string,
    page = 1,
    limit = DEFAULT_LIMIT
  ): Promise<PaginatedData<InterfaceTargetProperty>> {
    const offset = (page - 1) * limit

    const foundProperties = await this.targetPropertyModel
      .find({ huntId: huntId })
      .skip(offset)
      .limit(limit)
      .lean<LeanDoc<TargetProperty>[]>()
      .exec()

    const totalItems = await this.targetPropertyModel.countDocuments({
      huntId: huntId
    })
    const totalPages = Math.ceil(totalItems / limit)

    const result = {
      list: foundProperties.map((property) => {
        const { _id: id, __v, ...otherData } = property

        return { id: id.toString(), ...otherData }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async getHuntTargetByFullAddress(
    huntId: string,
    address: Pick<
      InterfaceTargetProperty,
      | 'neighborhood'
      | 'street'
      | 'city'
      | 'uf'
      | 'country'
      | 'lotNumber'
      | 'propertyNumber'
    >
  ): Promise<InterfaceTargetProperty> {
    const foundProperties = await this.targetPropertyModel
      .find({
        huntId: huntId,
        lotNumber: address.lotNumber,
        propertyNumber: address.propertyNumber,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        uf: address.uf,
        country: address.country
      })
      .lean<LeanDoc<TargetProperty>[]>()
      .exec()

    if (foundProperties.length <= 0) {
      return null
    }

    return foundProperties[0]
  }

  async getHuntTargetsByLot(
    huntId: string,
    address: Pick<
      InterfaceTargetProperty,
      'neighborhood' | 'street' | 'city' | 'uf' | 'country' | 'lotNumber'
    >
  ): Promise<InterfaceTargetProperty[]> {
    const foundProperties = await this.targetPropertyModel
      .find({
        huntId: huntId,
        lotNumber: address.lotNumber,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        uf: address.uf,
        country: address.country
      })
      .lean<LeanDoc<TargetProperty>[]>()
      .exec()

    if (foundProperties.length <= 0) {
      return null
    }

    return foundProperties
  }

  async getHuntTargetsByStreet(
    huntId: string,
    address: Pick<
      InterfaceTargetProperty,
      'neighborhood' | 'street' | 'city' | 'uf' | 'country'
    >
  ): Promise<InterfaceTargetProperty[]> {
    const foundProperties = await this.targetPropertyModel
      .find({
        huntId: huntId,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        uf: address.uf,
        country: address.country
      })
      .lean<LeanDoc<TargetProperty>[]>()
      .exec()

    if (foundProperties.length <= 0) {
      return null
    }

    return foundProperties
  }

  async getOneTargetById(id: string): Promise<InterfaceTargetProperty> {
    const property = await this.targetPropertyModel
      .findById(id)
      .lean<LeanDoc<TargetProperty>>()
      .exec()

    if (!property) return null

    const { _id, __v, ...otherData } = property

    return { id: _id.toString(), ...otherData }
  }

  async updateTargetProperty(
    id: string,
    data: Partial<InterfaceTargetProperty>
  ): Promise<InterfaceTargetProperty> {
    const foundProperty = this.getOneTargetById(id)

    if (!foundProperty) {
      return null
    }

    await this.targetPropertyModel
      .updateOne({ _id: id }, { ...foundProperty, ...data })
      .exec()

    return await this.getOneTargetById(id)
  }

  async deleteTargetProperty(id: string): Promise<DeleteResult> {
    return await this.targetPropertyModel.deleteOne({ _id: id }).exec()
  }
}
