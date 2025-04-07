import { DeleteResult } from 'mongoose';
import { InterfaceTargetProperty } from '../schemas/models/target-property.interface';
import { PaginatedData } from 'src/shared/types/response';

export abstract class TargetPropertyRepository {
  abstract getAllTargetsByHunt(
    huntId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedData<InterfaceTargetProperty>>;

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
