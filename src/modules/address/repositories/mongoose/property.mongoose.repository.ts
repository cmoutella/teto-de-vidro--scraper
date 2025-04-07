import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/const/pagination';
import { PropertyRepository } from '../property.repository';
import { Property } from '../../schemas/property.schema';
import { InterfaceProperty } from '../../schemas/models/property.interface';
import { PaginatedData } from 'src/shared/types/response';

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

  async getAllPropertiesByLotId(
    lotId: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<PaginatedData<InterfaceProperty>> {
    const offset = (page - 1) * limit;

    const foundProperties = await this.propertyModel
      .find({ lotId: lotId })
      .skip(offset)
      .limit(limit)
      .exec();

    const totalItems = await this.propertyModel.countDocuments({
      lotId: lotId,
    });

    const totalPages = Math.ceil(totalItems / limit);

    const result: PaginatedData<InterfaceProperty> = {
      list: foundProperties.map((prop) => {
        const { _id, __v, ...otherData } = prop.toObject();

        return { id: _id.toString(), ...otherData };
      }),
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit,
    };

    return result;
  }

  async getOnePropertyById(id: string): Promise<InterfaceProperty> {
    const foundProperty = await this.propertyModel.findById(id).exec();

    if (!foundProperty) return null;

    const { _id, __v, ...otherData } = foundProperty.toObject();

    return { id: _id.toString(), ...otherData };
  }

  async getOnePropertyByAddress(lotId: string, propertyNumber: string) {
    const foundProperty = await this.propertyModel
      .findOne({
        lotId: lotId,
        propertyNumber: propertyNumber,
      })
      .exec();

    if (!foundProperty) return null;

    const { _id, __v, ...otherData } = foundProperty.toObject();

    return { id: _id.toString(), ...otherData };
  }

  async updateProperty(
    id: string,
    data: Partial<InterfaceProperty>,
  ): Promise<InterfaceProperty> {
    const foundProperty = this.propertyModel.findById(id).exec();

    if (!foundProperty) {
      return null;
    }

    await this.propertyModel
      .updateOne({ _id: id }, { ...foundProperty, ...data })
      .exec();

    const updatedProperty = await this.propertyModel.findById(id).exec();

    const { _id, __v, ...otherData } = await updatedProperty.toObject();

    return { id: _id.toString(), ...otherData };
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyModel.deleteOne({ _id: id }).exec();
  }
}
