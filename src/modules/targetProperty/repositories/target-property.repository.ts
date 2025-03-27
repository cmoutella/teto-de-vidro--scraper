import { DeleteResult } from 'mongoose';
import { InterfaceTargetProperty } from '../schemas/models/target-property.interface';

export abstract class TargetPropertyRepository {
  abstract getAllTargetsByHunt(
    huntId: string,
    page?: number,
    limit?: number,
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
