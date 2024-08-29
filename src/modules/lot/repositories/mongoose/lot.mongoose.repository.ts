import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from '../../../../shared/default/pagination';
import { Lot } from '../../schemas/lot.schema';
import { LotRepository } from '../lot.repository';
import {
  InterfaceLot,
  InterfaceSearchLot,
} from '../../schemas/models/lot.interface';

export class LotMongooseRepository implements LotRepository {
  constructor(@InjectModel(Lot.name) private lotModel: Model<Lot>) {}

  async createLot(newLot: InterfaceLot): Promise<InterfaceLot | null> {
    const createLot = new this.lotModel(newLot);

    const lot = await createLot.save();

    if (!lot) return null;
    const { _id, ...data } = lot;

    return { id: _id.toString(), ...data };
  }

  async getAllLots(page = 1, limit = DEFAULT_LIMIT): Promise<InterfaceLot[]> {
    const offset = (page - 1) * limit;

    return await this.lotModel.find().skip(offset).limit(limit).exec();
  }

  async getAllLotsByAddress(
    searchBy: InterfaceSearchLot,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceLot[]> {
    const offset = (page - 1) * limit;

    if (
      !searchBy.address ||
      !searchBy.city ||
      !searchBy.province ||
      !searchBy.country
    ) {
      return [];
    }

    // TODO
    return await this.lotModel
      .find({ ...searchBy })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async getOneLot(id: string): Promise<InterfaceLot> {
    return await this.lotModel.findById(id).exec();
  }

  async updateLot(id: string, data: Partial<InterfaceLot>): Promise<void> {
    const foundLot = this.lotModel.findById(id).exec();

    if (!foundLot) {
      return null;
    }

    await this.lotModel.updateOne({ _id: id }, { ...foundLot, ...data }).exec();
  }

  async deleteLot(id: string): Promise<void> {
    await this.lotModel.deleteOne({ _id: id }).exec();
  }
}
