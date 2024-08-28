import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from '../../../../shared/default/pagination';
import { Property } from '../../schemas/property.schema';
import { PropertyRepository } from '../property.repository';
import { InterfaceProperty } from '../../schemas/models/property.interface';

export class PropertyMongooseRepository implements PropertyRepository {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  async createProperty(newProperty: InterfaceProperty): Promise<void> {
    const createProperty = new this.propertyModel(newProperty);

    await createProperty.save();
  }

  async getAllProperties(
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceProperty[]> {
    const offset = (page - 1) * limit;

    return await this.propertyModel.find().skip(offset).limit(limit).exec();
  }

  async getAllPropertiesByAddress(
    keyword: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceProperty[]> {
    const offset = (page - 1) * limit;

    // TODO
    return await this.propertyModel
      .find({ keyWords: keyword })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async getOneProperty(id: string): Promise<InterfaceProperty> {
    return await this.propertyModel.findById(id).exec();
  }

  async updateProperty(
    id: string,
    data: Partial<InterfaceProperty>,
  ): Promise<void> {
    const foundProperty = this.propertyModel.findById(id).exec();

    if (!foundProperty) {
      return null;
    }

    await this.propertyModel
      .updateOne({ _id: id }, { ...foundProperty, ...data })
      .exec();
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyModel.deleteOne({ _id: id }).exec();
  }
}
