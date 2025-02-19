import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/const/pagination';
import { PropertyRepository } from '../property.repository';
import { Property } from '../../schemas/property.schema';
import { InterfaceProperty } from '../../schemas/models/property.interface';

export class PropertyMongooseRepository implements PropertyRepository {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  async createProperty(newProperty: InterfaceProperty): Promise<Property> {
    const createProperty = new this.propertyModel(newProperty);

    await createProperty.save();

    const { _id, __v, ...data } = createProperty.toObject();

    return { id: _id.toString(), ...data };
  }

  async getAllPropertiesByMainAddress(
    lotId: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceProperty[]> {
    const offset = (page - 1) * limit;

    const foundProperties = await this.propertyModel
      .find({ lotId: lotId })
      .skip(offset)
      .limit(limit)
      .exec();

    return foundProperties.map((prop) => prop.toObject());
  }

  async getOnePropertyById(id: string): Promise<InterfaceProperty> {
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
