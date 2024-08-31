import { InterfaceProperty } from '../schemas/models/property.interface';

export abstract class PropertyRepository {
  abstract getAllProperties(
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]>;

  abstract getAllPropertiesByMainAddress(
    mainAddressId: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceProperty[]>;

  abstract getOnePropertyById(id: string): Promise<InterfaceProperty>;

  abstract createProperty(
    newProperty: InterfaceProperty,
  ): Promise<InterfaceProperty>;

  abstract updateProperty(
    id: string,
    data: Partial<InterfaceProperty>,
  ): Promise<void>;

  abstract deleteProperty(id: string): Promise<void>;
}
