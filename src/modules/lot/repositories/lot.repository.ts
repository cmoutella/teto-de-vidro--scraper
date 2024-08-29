import { InterfaceLot } from '../schemas/models/lot.interface';

export abstract class LotRepository {
  abstract getAllLots(page?: number, limit?: number): Promise<InterfaceLot[]>;

  abstract getAllLotsByAddress(
    address: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceLot[]>;

  abstract getOneLot(id: string): Promise<InterfaceLot>;

  abstract createLot(newPost: InterfaceLot): Promise<void>;

  abstract updateLot(id: string, data: Partial<InterfaceLot>): Promise<void>;

  abstract deleteLot(id: string): Promise<void>;
}
