import { Injectable, NotFoundException } from '@nestjs/common';
import { HuntRepository } from '../repositories/hunt.repository';
import { InterfaceHunt } from '../schemas/models/hunt.interface';

@Injectable()
export class HuntService {
  constructor(private readonly huntRepository: HuntRepository) {}

  async createHunt(newHunt: InterfaceHunt): Promise<InterfaceHunt | null> {
    return await this.huntRepository.createHunt(newHunt);
  }

  async getAllHuntsByUser(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceHunt[]> {
    return await this.huntRepository.getAllHuntsByUser(userId, page, limit);
  }

  async addTargetToHunt(huntId: string, targetId: string): Promise<void> {
    return await this.huntRepository.addTargetToHunt(huntId, targetId);
  }

  async getOneHuntById(id: string): Promise<InterfaceHunt> {
    const Hunt = await this.huntRepository.getOneHuntById(id);

    if (!Hunt) throw new NotFoundException('Endereço não encontrado');
    return Hunt;
  }

  async updateHunt(id: string, data: Partial<InterfaceHunt>): Promise<void> {
    return await this.huntRepository.updateHunt(id, data);
  }

  async deleteHunt(id: string): Promise<void> {
    await this.huntRepository.deleteHunt(id);
  }
}
