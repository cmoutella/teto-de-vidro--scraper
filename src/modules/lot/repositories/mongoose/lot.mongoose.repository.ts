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

    await createLot.save();

    return createLot.toObject();
  }

  async getAllLotsByAddress(
    searchBy: InterfaceSearchLot,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceLot[]> {
    const offset = (page - 1) * limit;

    if (
      !searchBy.street ||
      !searchBy.city ||
      !searchBy.province ||
      !searchBy.country
    ) {
      return [];
    }

    // TODO
    const foundLots = await this.lotModel
      .find({ ...searchBy })
      .skip(offset)
      .limit(limit)
      .exec();

    return foundLots.map((lot) => {
      const { _id, ...data } = lot;

      return { id: _id.toString(), ...data };
    });
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
