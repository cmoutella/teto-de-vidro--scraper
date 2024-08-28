import { InterfaceProperty } from '../schemas/models/property.interface';

export abstract class PropertyRepository {
  abstract getAllProperties(
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]>;

  abstract getAllPropertiesByAddress(
    address: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]>;

  abstract getOneProperty(id: string): Promise<InterfaceProperty>;

  abstract createProperty(newPost: InterfaceProperty): Promise<void>;

  abstract updateProperty(
    id: string,
    data: Partial<InterfaceProperty>,
  ): Promise<void>;

  abstract deleteProperty(id: string): Promise<void>;
}
