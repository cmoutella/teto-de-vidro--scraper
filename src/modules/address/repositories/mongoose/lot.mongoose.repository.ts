import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/const/pagination';
import { LotRepository } from '../lot.repository';
import { Lot } from '../../schemas/lot.schema';
import {
  InterfaceLot,
  InterfaceSearchLot,
} from '../../schemas/models/lot.interface';
import { BadRequestException } from '@nestjs/common';
import { PaginatedData } from 'src/shared/types/response';

export class LotMongooseRepository implements LotRepository {
  constructor(@InjectModel(Lot.name) private lotModel: Model<Lot>) {}

  async createLot(newLot: InterfaceLot): Promise<InterfaceLot | null> {
    const createLot = new this.lotModel(newLot);

    await createLot.save();

    const { _id, __v, ...data } = createLot.toObject();

    return { id: _id.toString(), ...data };
  }

  async getOneLotByAddress(cep: string, lotNumber: string) {
    const foundLot = await this.lotModel
      .findOne({
        postalCode: cep,
        lotNumber: lotNumber,
      })
      .exec();

    if (!foundLot) {
      return null;
    }

    const { _id, __v, ...data } = foundLot.toObject();

    return { id: _id.toString(), ...data };
  }

  // TODO
  async getAllLotsByAddress(
    searchBy: InterfaceSearchLot,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<PaginatedData<InterfaceLot>> {
    const offset = (page - 1) * limit;

    if (!searchBy.street || !searchBy.city || !searchBy.country) {
      return {
        list: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        perPage: limit,
      };
    }

    // TODO
    const foundLots = await this.lotModel
      .find({
        street: searchBy.street,
        city: searchBy.city,
        country: searchBy.country,
      })
      .skip(offset)
      .limit(limit)
      .exec();

    const totalItems = await this.lotModel.countDocuments({
      street: searchBy.street,
      city: searchBy.city,
      country: searchBy.country,
    });

    const totalPages = Math.ceil(totalItems / limit);

    const result: PaginatedData<InterfaceLot> = {
      list: foundLots.map((lot) => {
        const lotObj = lot.toObject();
        const { _id, ...data } = lotObj;

        return { id: _id.toString(), ...data };
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit,
    };

    return result;
  }

  async getAllLotsByCEP(
    cep: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<PaginatedData<InterfaceLot>> {
    const offset = (page - 1) * limit;

    if (!cep) {
      throw new BadRequestException('CEP não informado');
    }

    const foundLots = await this.lotModel
      .find({
        postalCode: cep,
      })
      .skip(offset)
      .limit(limit)
      .exec();

    const totalItems = await this.lotModel.countDocuments({
      postalCode: cep,
    });

    const totalPages = Math.ceil(totalItems / limit);

    const result: PaginatedData<InterfaceLot> = {
      list: foundLots.map((lot) => {
        const { _id, __v, ...data } = lot.toObject();

        return { id: _id.toString(), ...data };
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit,
    };

    return result;
  }

  async getOneLot(id: string): Promise<InterfaceLot> {
    const data = await this.lotModel.findById(id).exec();

    if (!data) {
      return null;
    }

    const { _id, __v, ...otherData } = data.toObject();

    return { id: _id.toString(), ...otherData };
  }

  async updateLot(id: string, data: Partial<InterfaceLot>): Promise<Lot> {
    const foundLot = this.lotModel.findById(id).exec();

    if (!foundLot) {
      throw new BadRequestException('Lote não encontrado');
    }

    await this.lotModel.updateOne({ _id: id }, { ...foundLot, ...data }).exec();

    const updated = await this.lotModel.findById(id).exec();
    const { _id, __v, ...otherData } = await updated.toObject();

    return { id: _id.toString(), ...otherData };
  }

  async deleteLot(id: string): Promise<void> {
    await this.lotModel.deleteOne({ _id: id }).exec();
  }
}
