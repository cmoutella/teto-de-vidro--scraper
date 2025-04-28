import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LeanDoc } from 'src/shared/types/mongoose'

import { Amenity } from '../../schemas/amenity.schema'
import { InterfaceAmenity } from '../../schemas/models/amenity.interface'
import { AmenityRepository } from '../amenity.repository'

export class AmenityMongooseRepository implements AmenityRepository {
  constructor(
    @InjectModel(Amenity.name) private amenityModel: Model<Amenity>
  ) {}

  async createAmenity(
    newAmenity: InterfaceAmenity
  ): Promise<InterfaceAmenity | null> {
    const createAmenity = new this.amenityModel(newAmenity)

    await createAmenity.save()

    const created = await this.amenityModel
      .findById(createAmenity._id)
      .lean<LeanDoc<InterfaceAmenity>>()
      .exec()

    const { _id, __v, ...data } = created

    return { id: _id.toString(), ...data }
  }

  async getOneAmenityById(id: string): Promise<InterfaceAmenity> {
    const data = await this.amenityModel
      .findById(id)
      .lean<LeanDoc<InterfaceAmenity>>()
      .exec()

    if (!data) {
      return null
    }

    const { _id, __v, ...otherData } = data

    return { id: _id.toString(), ...otherData }
  }

  async getOneAmenityByLabel(label: string): Promise<InterfaceAmenity> {
    const data = await this.amenityModel
      .find({ label: label.trim() })
      .lean<LeanDoc<InterfaceAmenity>>()
      .exec()

    if (!data) {
      return null
    }

    const { _id, __v, ...otherData } = data

    return { id: _id.toString(), ...otherData }
  }

  async updateAmenity(
    id: string,
    data: Partial<InterfaceAmenity>
  ): Promise<InterfaceAmenity> {
    const foundAmenity = await this.getOneAmenityById(id)

    if (!foundAmenity) return

    await this.amenityModel
      .updateOne({ _id: id }, { ...foundAmenity, ...data })
      .exec()

    const updated = await this.getOneAmenityById(id)

    return updated
  }

  async deleteAmenity(id: string): Promise<void> {
    await this.amenityModel.deleteOne({ _id: id }).exec()
  }
}
