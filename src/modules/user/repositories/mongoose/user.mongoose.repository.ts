import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LeanDoc } from 'src/shared/types/mongoose'

import {
  InterfaceUser,
  PublicInterfaceUser
} from '../../schemas/models/user.interface'
import { User, UserDocument } from '../../schemas/user.schema'
import { UserRepository } from '../user.repository'

export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser> {
    const createUser = new this.userModel(newUser)
    await createUser.save()

    const created = await this.userModel
      .findById(createUser._id)
      .lean<LeanDoc<InterfaceUser>>()
      .exec()

    const { _id: id, __v, ...otherData } = created

    return { id: id.toString(), ...otherData }
  }

  async getAllUsers(): Promise<Omit<InterfaceUser, 'password'>[]> {
    const users = await this.userModel
      .find()
      .lean<LeanDoc<InterfaceUser>[]>()
      .exec()
      .then((res) =>
        res.map((user) => {
          const { password, _id, ...userData } = user
          return { id: _id.toString(), ...userData }
        })
      )

    return users
  }

  async getById(id: string): Promise<InterfaceUser | null> {
    const { _id, ...userData } = await this.userModel
      .findById({ _id: id })
      .lean<LeanDoc<InterfaceUser>>()
      .exec()

    const data = {
      id: _id.toString(),
      ...userData
    }

    return data
  }

  async getByEmail(email: string): Promise<InterfaceUser | null> {
    const user = await this.userModel
      .findOne({ email: email })
      .lean<LeanDoc<InterfaceUser>>()
      .exec()

    if (!user) return null

    const { _id, ...userData } = user
    const data = {
      id: _id.toString(),
      ...userData
    }

    return data
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec()
  }
}
