import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/const/pagination';
import { HuntRepository } from '../hunt.repository';
import { Hunt } from '../../schemas/hunt.schema';
import { InterfaceHunt } from '../../schemas/models/hunt.interface';
import { InternalServerErrorException } from '@nestjs/common';

export class HuntMongooseRepository implements HuntRepository {
  constructor(@InjectModel(Hunt.name) private huntModel: Model<Hunt>) {}

  async createHunt(newHunt: InterfaceHunt): Promise<InterfaceHunt | null> {
    const createHunt = new this.huntModel(newHunt);

    await createHunt.save();

    const { _id, __v, ...data } = createHunt.toObject();

    return { id: _id, ...data } as InterfaceHunt;
  }

  // ordenar por mais recentemente alterado
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

    return foundHunts.map((hunt) => {
      const { _id: id, __v, ...otherData } = hunt.toObject();

      return { id: id.toString(), ...otherData };
    });
  }

  async addTargetToHunt(huntId: string, targetId: string): Promise<void> {
    const hunt = await this.huntModel.findById(huntId).exec();

    if (!hunt) return;

    const { __v, ...otherData } = hunt.toObject();

    const data = await this.huntModel
      .updateOne(
        { _id: huntId },
        { ...otherData, targets: [...otherData.targets, targetId] },
      )
      .exec();

    if (!data) {
      throw new InternalServerErrorException();
    }
  }

  async getOneHuntById(id: string): Promise<InterfaceHunt> {
    const found = await this.huntModel.findById(id).exec();

    if (!found) {
      return null;
    }

    const { _id, __v, ...otherData } = found.toObject();

    return { id: _id.toString(), ...otherData };
  }

  async updateHunt(
    id: string,
    data: Partial<InterfaceHunt>,
  ): Promise<InterfaceHunt> {
    const foundHunt = await this.huntModel.findById(id).exec();

    if (!foundHunt) {
      return null;
    }

    const { __v, ...otherData } = await foundHunt.toObject();

    await this.huntModel
      .updateOne({ _id: id }, { ...otherData, ...data })
      .exec();

    return await this.getOneHuntById(id);
  }

  async deleteHunt(id: string): Promise<void> {
    await this.huntModel.deleteOne({ _id: id }).exec();
  }
}
