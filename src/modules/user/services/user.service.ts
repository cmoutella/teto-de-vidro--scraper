import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException
} from '@nestjs/common'

import { UserRepository } from '../repositories/user.repository'
import {
  InterfaceUser,
  PublicInterfaceUser
} from '../schemas/models/user.interface'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: InterfaceUser): Promise<PublicInterfaceUser> {
    if (!user.nickName || !user.password || !user.email || !user.birthDate) {
      throw new BadRequestException('Username or password missing')
    }

    const existingUser = await this.userRepository.getByEmail(user.email)

    if (existingUser) {
      throw new ConflictException('Nome de usuário em uso')
    }

    return await this.userRepository.createUser(user)
  }

  async getAllUsers(): Promise<PublicInterfaceUser[]> {
    return await this.userRepository.getAllUsers()
  }

  async getByEmail(email: string): Promise<InterfaceUser> {
    const user = await this.userRepository.getByEmail(email)

    console.log('user', user)
    if (!user) throw new NotFoundException('Usuário não encontrado')

    return user
  }

  async getById(id: string): Promise<InterfaceUser> {
    const user = await this.userRepository.getById(id)
    if (!user) throw new NotFoundException()
    return user
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.getById(id)
    if (!user) throw new NotFoundException()
    await this.userRepository.deleteUser(id)
  }
}
