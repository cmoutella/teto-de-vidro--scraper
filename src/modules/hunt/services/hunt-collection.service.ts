import { Injectable } from '@nestjs/common'
import { PaginatedData } from 'src/shared/types/response'

import { HuntRepository } from '../repositories/hunt.repository'
import {
  CreateHuntServiceDate,
  InterfaceHunt
} from '../schemas/models/hunt.interface'

@Injectable()
export class HuntService {
  constructor(private readonly huntRepository: HuntRepository) {}

  async createHunt(
    newHunt: CreateHuntServiceDate
  ): Promise<InterfaceHunt | undefined> {
    if (!newHunt.creatorId) {
      return undefined
    }

    return await this.huntRepository.createHunt(newHunt)
  }

  async getAllHuntsByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceHunt> | undefined> {
    if (!userId) return undefined

    return await this.huntRepository.getAllHuntsByUser(userId, page, limit)
  }

  async addTargetToHunt(huntId: string, targetId: string): Promise<boolean> {
    if (!huntId) return undefined
    if (!targetId) return undefined

    try {
      await this.huntRepository.addTargetToHunt(huntId, targetId)

      return true
    } catch (_err) {
      return false
    }
  }

  async removeTargetFromHunt(
    huntId: string,
    targetId: string
  ): Promise<boolean> {
    if (!huntId) return undefined
    if (!targetId) return undefined

    try {
      await this.huntRepository.removeTargetFromHunt(huntId, targetId)

      return true
    } catch (_err) {
      return false
    }
  }

  async getOneHuntById(id: string): Promise<InterfaceHunt | undefined> {
    if (!id) return undefined

    const hunt = await this.huntRepository.getOneHuntById(id)

    if (!hunt) return undefined
    return hunt
  }

  async updateHunt(
    id: string,
    data: Partial<InterfaceHunt>
  ): Promise<InterfaceHunt | undefined> {
    if (!id) return undefined

    return await this.huntRepository.updateHunt(id, data)
  }

  async deleteHunt(id: string): Promise<boolean> {
    if (!id) {
      return undefined
    }

    try {
      await this.huntRepository.deleteHunt(id)

      return true
    } catch (_err) {
      return false
    }
  }
}
