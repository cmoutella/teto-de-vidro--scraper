import { DeleteResult } from 'mongoose';
import { InterfaceTargetProperty } from '../schemas/models/target-property.interface';
import { PaginatedData } from 'src/shared/types/response';

export abstract class TargetPropertyRepository {
  abstract getAllTargetsByHunt(
    huntId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedData<InterfaceTargetProperty>>;

  abstract getHuntTargetByFullAddress(
    huntId: string,
    address: Pick<
      InterfaceTargetProperty,
      | 'neighborhood'
      | 'street'
      | 'city'
      | 'uf'
      | 'country'
      | 'lotNumber'
      | 'propertyNumber'
    >,
  ): Promise<InterfaceTargetProperty>;

  abstract getHuntTargetsByLot(
    huntId: string,
    address: Pick<
      InterfaceTargetProperty,
      'neighborhood' | 'street' | 'city' | 'uf' | 'country' | 'lotNumber'
    >,
  ): Promise<InterfaceTargetProperty[]>;

  abstract getHuntTargetsByStreet(
    huntId: string,
    address: Pick<
      InterfaceTargetProperty,
      'neighborhood' | 'street' | 'city' | 'uf' | 'country'
    >,
  ): Promise<InterfaceTargetProperty[]>;

  abstract getOneTargetById(id: string): Promise<InterfaceTargetProperty>;

  abstract createTargetProperty(
    newTargetProperty: InterfaceTargetProperty,
  ): Promise<InterfaceTargetProperty>;

  abstract updateTargetProperty(
    id: string,
    data: Partial<InterfaceTargetProperty>,
  ): Promise<InterfaceTargetProperty>;

  abstract deleteTargetProperty(id: string): Promise<DeleteResult>;
}
