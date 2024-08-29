import {
  InterfaceLot,
  InterfaceSearchLot,
} from '../schemas/models/lot.interface';

export abstract class LotRepository {
  abstract getAllLotsByAddress(
    searchBy: InterfaceSearchLot,
    page?: number,
    limit?: number,
  ): Promise<InterfaceLot[]>;

  abstract getOneLot(id: string): Promise<InterfaceLot>;

  abstract createLot(newPost: InterfaceLot): Promise<InterfaceLot | null>;

  abstract updateLot(id: string, data: Partial<InterfaceLot>): Promise<void>;

  abstract deleteLot(id: string): Promise<void>;
}
