import { Injectable, NotFoundException } from '@nestjs/common';
import { LotRepository } from '../repositories/lot.repository';
import {
  InterfaceLot,
  InterfaceSearchLot,
} from '../schemas/models/lot.interface';

@Injectable()
export class LotService {
  constructor(private readonly lotRepository: LotRepository) {}

  async createLot(newLot: InterfaceLot): Promise<InterfaceLot | null> {
    return await this.lotRepository.createLot(newLot);
  }

  async getAllLotsByAddress(
    addressParams: InterfaceSearchLot,
    page?: number,
    limit?: number,
  ): Promise<InterfaceLot[]> {
    return await this.lotRepository.getAllLotsByAddress(
      addressParams,
      page,
      limit,
    );
  }

  async getOneLot(id: string): Promise<InterfaceLot> {
    const Lot = await this.lotRepository.getOneLot(id);

    if (!Lot) throw new NotFoundException('Endereço não encontrado');
    return Lot;
  }

  async updateLot(id: string, data: Partial<InterfaceLot>): Promise<void> {
    return await this.lotRepository.updateLot(id, data);
  }

  async deleteLot(id: string): Promise<void> {
    await this.lotRepository.deleteLot(id);
  }
}
