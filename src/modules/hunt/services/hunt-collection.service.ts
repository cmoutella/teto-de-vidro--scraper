import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { TargetPropertyRepository } from 'src/modules/targetProperty/repositories/target-property.repository'
import { PaginatedData } from 'src/shared/types/response'

import { HuntRepository } from '../repositories/hunt.repository'
import { InterfaceHunt } from '../schemas/models/hunt.interface'

@Injectable()
export class HuntService {
  constructor(
    private readonly huntRepository: HuntRepository,
    @Inject(forwardRef(() => TargetPropertyRepository))
    private readonly targetPropertyRepository: TargetPropertyRepository
  ) {}

  async createHunt(newHunt: InterfaceHunt): Promise<InterfaceHunt | null> {
    if (!newHunt.creatorId) {
      throw new BadRequestException(
        'É necessário um usuário para criar uma hunt'
      )
    }

    return await this.huntRepository.createHunt(newHunt)
  }

  async getAllHuntsByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceHunt>> {
    return await this.huntRepository.getAllHuntsByUser(userId, page, limit)
  }

  async addTargetToHunt(huntId: string, targetId: string): Promise<void> {
    return await this.huntRepository.addTargetToHunt(huntId, targetId)
  }

  async removeTargetFromHunt(huntId: string, targetId: string): Promise<void> {
    return await this.huntRepository.removeTargetFromHunt(huntId, targetId)
  }

  async getOneHuntById(id: string): Promise<InterfaceHunt> {
    const hunt = await this.huntRepository.getOneHuntById(id)

    if (!hunt) throw new NotFoundException('Hunt não encontrada')
    return hunt
  }

  async updateHunt(
    id: string,
    data: Partial<InterfaceHunt>
  ): Promise<InterfaceHunt> {
    return await this.huntRepository.updateHunt(id, data)
  }

  async deleteHunt(id: string): Promise<void> {
    const huntData = await this.getOneHuntById(id)

    if (!huntData) {
      throw new NotFoundException('Hunt não encontrada')
    }

    console.log(huntData.targets)
    huntData.targets.forEach(async (target) => {
      console.log('removendo target', target)
      await this.targetPropertyRepository.deleteTargetProperty(target)
    })

    console.log('agora a hunt')
    await this.huntRepository.deleteHunt(id)
  }
}
