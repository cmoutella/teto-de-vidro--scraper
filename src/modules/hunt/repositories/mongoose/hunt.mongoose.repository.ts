import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from '../../../../shared/default/pagination';
import { Hunt } from '../../schemas/hunt.schema';
import { HuntRepository } from '../hunt.repository';
import { InterfaceHunt } from '../../schemas/models/hunt.interface';

export class HuntMongooseRepository implements HuntRepository {
  constructor(@InjectModel(Hunt.name) private huntModel: Model<Hunt>) {}

  async createHunt(newHunt: InterfaceHunt): Promise<InterfaceHunt | null> {
    const createHunt = new this.huntModel(newHunt);

    await createHunt.save();

    return createHunt.toObject();
  }

  async getAllHuntsByUser(
    userId: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceHunt[]> {
    const offset = (page - 1) * limit;

    const foundHunts = await this.huntModel
      .find({ creatorId: userId })
      .skip(offset)
      .limit(limit)
      .exec();

    return foundHunts.map((hunt) => hunt.toObject());
  }

  async getOneHuntById(id: string): Promise<InterfaceHunt> {
    return await this.huntModel.findById(id).exec();
  }

  async updateHunt(id: string, data: Partial<InterfaceHunt>): Promise<void> {
    const foundHunt = this.huntModel.findById(id).exec();

    if (!foundHunt) {
      return null;
    }

    await this.huntModel
      .updateOne({ _id: id }, { ...foundHunt, ...data })
      .exec();
  }

  async deleteHunt(id: string): Promise<void> {
    await this.huntModel.deleteOne({ _id: id }).exec();
  }
}
