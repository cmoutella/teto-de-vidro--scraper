import type { PaginatedData } from 'src/shared/types/response'

import type {
  InterfaceLot,
  InterfaceSearchLot
} from '../schemas/models/lot.interface'

export abstract class LotRepository {
  abstract getOneLotByAddress(
    cep: string,
    lotNumber: string
  ): Promise<InterfaceLot>

  abstract getAllLotsByAddress(
    searchBy: InterfaceSearchLot,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceLot>>

  abstract getAllLotsByCEP(
    cep: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedData<InterfaceLot>>

  abstract getOneLot(id: string): Promise<InterfaceLot>

  abstract createLot(newLot: InterfaceLot): Promise<InterfaceLot | null>

  abstract updateLot(
    id: string,
    data: Partial<InterfaceLot>
  ): Promise<InterfaceLot>

  abstract deleteLot(id: string): Promise<void>
}
