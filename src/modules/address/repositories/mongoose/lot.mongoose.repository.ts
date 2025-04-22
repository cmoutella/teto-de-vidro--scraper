import { BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DEFAULT_LIMIT } from 'src/shared/const/pagination'
import { LeanDoc } from 'src/shared/types/mongoose'
import { PaginatedData } from 'src/shared/types/response'

import { Lot } from '../../schemas/lot.schema'
import {
  InterfaceLot,
  InterfaceSearchLot
} from '../../schemas/models/lot.interface'
import { LotRepository } from '../lot.repository'

export class LotMongooseRepository implements LotRepository {
  constructor(@InjectModel(Lot.name) private lotModel: Model<Lot>) {}

  async createLot(newLot: InterfaceLot): Promise<InterfaceLot | null> {
    const createLot = new this.lotModel(newLot)

    await createLot.save()

    const created = await this.lotModel
      .findById(createLot._id)
      .lean<LeanDoc<InterfaceLot>>()
      .exec()

    const { _id, __v, ...data } = created

    return { id: _id.toString(), ...data }
  }

  async getOneLotByAddress(cep: string, lotNumber: string) {
    const foundLot = await this.lotModel
      .findOne({
        postalCode: cep,
        lotNumber: lotNumber
      })
      .lean<LeanDoc<InterfaceLot>>()
      .exec()

    if (!foundLot) {
      return null
    }

    const { _id, __v, ...data } = foundLot

    return { id: _id.toString(), ...data }
  }

  async getAllLotsByAddress(
    searchBy: InterfaceSearchLot,
    page = 1,
    limit = DEFAULT_LIMIT
  ): Promise<PaginatedData<InterfaceLot>> {
    const offset = (page - 1) * limit

    if (!searchBy.street || !searchBy.city || !searchBy.country) {
      return {
        list: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        perPage: limit
      }
    }

    const foundLots = await this.lotModel
      .find({
        street: searchBy.street,
        city: searchBy.city,
        uf: searchBy.uf,
        noLotNumber: searchBy.noLotNumber,
        lotNumber: searchBy.noLotNumber ? '0' : searchBy.lotNumber,
        country: searchBy.country
      })
      .skip(offset)
      .limit(limit)
      .lean<LeanDoc<InterfaceLot>[]>()
      .exec()

    const totalItems = await this.lotModel.countDocuments({
      street: searchBy.street,
      city: searchBy.city,
      uf: searchBy.uf,
      noLotNumber: searchBy.noLotNumber,
      lotNumber: searchBy.noLotNumber ? '0' : searchBy.lotNumber,
      country: searchBy.country
    })

    const totalPages = Math.ceil(totalItems / limit)

    const result: PaginatedData<InterfaceLot> = {
      list: foundLots.map((lot) => {
        const lotObj = lot
        const { _id, __v, ...data } = lotObj

        return { id: _id.toString(), ...data }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async getAllLotsByCEP(
    cep: string,
    page = 1,
    limit = DEFAULT_LIMIT
  ): Promise<PaginatedData<InterfaceLot>> {
    const offset = (page - 1) * limit

    if (!cep) {
      throw new BadRequestException('CEP não informado')
    }

    const foundLots = await this.lotModel
      .find({
        postalCode: cep
      })
      .skip(offset)
      .limit(limit)
      .lean<LeanDoc<InterfaceLot>[]>()
      .exec()

    const totalItems = await this.lotModel.countDocuments({
      postalCode: cep
    })

    const totalPages = Math.ceil(totalItems / limit)

    const result: PaginatedData<InterfaceLot> = {
      list: foundLots.map((lot) => {
        const { _id, __v, ...data } = lot

        return { id: _id.toString(), ...data }
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit
    }

    return result
  }

  async getOneLot(id: string): Promise<InterfaceLot> {
    const data = await this.lotModel
      .findById(id)
      .lean<LeanDoc<InterfaceLot>>()
      .exec()

    if (!data) {
      return null
    }

    const { _id, __v, ...otherData } = data

    return { id: _id.toString(), ...otherData }
  }

  async updateLot(
    id: string,
    data: Partial<InterfaceLot>
  ): Promise<InterfaceLot> {
    const foundLot = await this.getOneLot(id)

    if (!foundLot) {
      throw new BadRequestException('Lote não encontrado')
    }

    await this.lotModel.updateOne({ _id: id }, { ...foundLot, ...data }).exec()

    const updated = await this.getOneLot(id)

    return updated
  }

  async deleteLot(id: string): Promise<void> {
    await this.lotModel.deleteOne({ _id: id }).exec()
  }
}
