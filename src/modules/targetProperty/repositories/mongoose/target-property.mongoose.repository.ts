/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/const/pagination';
import { TargetPropertyRepository } from '../target-property.repository';
import { InterfaceTargetProperty } from '../../schemas/models/target-property.interface';
import { TargetProperty } from '../../schemas/target-property.schema';
import { PaginatedData } from 'src/shared/types/response';
import { LeanDoc } from 'src/shared/types/mongoose';

export class TargetPropertyMongooseRepository
  implements TargetPropertyRepository
{
  constructor(
    @InjectModel(TargetProperty.name)
    private targetPropertyModel: Model<TargetProperty>,
  ) {}

  async createTargetProperty(
    newTarget: InterfaceTargetProperty,
  ): Promise<TargetProperty> {
    const createProperty = new this.targetPropertyModel(newTarget);

    await createProperty.save();

    if (!createProperty) return null;

    const created = await this.targetPropertyModel
      .findById(createProperty._id)
      .lean<LeanDoc<TargetProperty>>()
      .exec();

    const { _id: id, __v, ...otherData } = created;

    return { id: id.toString(), ...otherData };
  }

  async getAllTargetsByHunt(
    huntId: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<PaginatedData<InterfaceTargetProperty>> {
    const offset = (page - 1) * limit;

    const foundProperties = await this.targetPropertyModel
      .find({ huntId: huntId })
      .skip(offset)
      .limit(limit)
      .lean<LeanDoc<TargetProperty>[]>()
      .exec();

    const totalItems = await this.targetPropertyModel.countDocuments({
      huntId: huntId,
    });
    const totalPages = Math.ceil(totalItems / limit);

    const result = {
      list: foundProperties.map((property) => {
        const { _id: id, __v, ...otherData } = property;

        return { id: id.toString(), ...otherData };
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit,
    };

    return result;
  }

  async getOneTargetById(id: string): Promise<InterfaceTargetProperty> {
    const property = await this.targetPropertyModel
      .findById(id)
      .lean<LeanDoc<TargetProperty>>()
      .exec();

    if (!property) return null;

    const { _id, __v, ...otherData } = property;

    return { id: _id.toString(), ...otherData };
  }

  async updateTargetProperty(
    id: string,
    data: Partial<InterfaceTargetProperty>,
  ): Promise<InterfaceTargetProperty> {
    const foundProperty = this.getOneTargetById(id);

    if (!foundProperty) {
      return null;
    }

    await this.targetPropertyModel
      .updateOne({ _id: id }, { ...foundProperty, ...data })
      .exec();

    return await this.getOneTargetById(id);
  }

  async deleteTargetProperty(id: string): Promise<DeleteResult> {
    return await this.targetPropertyModel.deleteOne({ _id: id }).exec();
  }
}
