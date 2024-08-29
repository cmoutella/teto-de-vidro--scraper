import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from '../../../../shared/default/pagination';
import { Lot } from '../../schemas/lot.schema';
import { LotRepository } from '../lot.repository';
import { InterfaceLot } from '../../schemas/models/lot.interface';

export class LotMongooseRepository implements LotRepository {
  constructor(@InjectModel(Lot.name) private lotModel: Model<Lot>) {}

  async createLot(newLot: InterfaceLot): Promise<void> {
    const createLot = new this.lotModel(newLot);

    await createLot.save();
  }

  async getAllLots(page = 1, limit = DEFAULT_LIMIT): Promise<InterfaceLot[]> {
    const offset = (page - 1) * limit;

    return await this.lotModel.find().skip(offset).limit(limit).exec();
  }

  async getAllLotsByAddress(
    keyword: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceLot[]> {
    const offset = (page - 1) * limit;

    // TODO
    return await this.lotModel
      .find({ keyWords: keyword })
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
