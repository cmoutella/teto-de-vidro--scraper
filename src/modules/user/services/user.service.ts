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
import { CreateUser } from '../schemas/zod-validation/create-user.zod-validation'
import { InviteUser } from '../schemas/zod-validation/invite-user.zod-validation'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: CreateUser): Promise<PublicInterfaceUser> {
    if (!user.password || !user.email) {
      throw new BadRequestException('Username or password missing')
    }

    if (!user.name || !user.familyName || !user.cpf) {
      throw new BadRequestException('Identification missing')
    }

    const existingUserEmail = await this.userRepository.getByEmail(user.email)

    if (existingUserEmail) {
      throw new ConflictException('Email já cadastrado')
    }

    const existingUserCPF = await this.userRepository.getByCPF(user.cpf)

    if (existingUserCPF) {
      throw new ConflictException('CPF já cadastrado')
    }

    const createUser = {
      ...user,
      accessLevel: user.accessLevel ?? 0,
      status: user.status ?? 'regular',
      gender: user.gender ?? 'neutral'
    } as Omit<InterfaceUser, 'createdAt' | 'updatedAt' | 'lastLogin'>

    return await this.userRepository.createUser(createUser)
  }

  async inviteUser(user: InviteUser): Promise<PublicInterfaceUser> {
    const existingUserEmail = await this.userRepository.getByEmail(user.email)
    if (existingUserEmail) {
      throw new ConflictException('Email já cadastrado')
    }

    const createUser = {
      ...user,
      accessLevel: 0,
      status: 'guest'
    } as Pick<InterfaceUser, 'name' | 'email' | 'accessLevel' | 'status'>

    return this.userRepository.inviteUser(createUser)
  }

  async getAllUsers(): Promise<PublicInterfaceUser[]> {
    return await this.userRepository.getAllUsers()
  }

  async getByEmail(email: string): Promise<InterfaceUser> {
    const user = await this.userRepository.getByEmail(email)

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
