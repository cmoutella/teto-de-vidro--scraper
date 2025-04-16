import { InterfaceLot } from './lot.interface';
import { InterfaceProperty } from './property.interface';

export interface InterfaceAddress
  extends Omit<InterfaceProperty, 'id' | 'lotId' | 'createdAt' | 'updatedAt'>,
    Omit<InterfaceLot, 'id' | 'createdAt' | 'updatedAt'> {}

export interface InterfaceSearchAddress {
  street: string;
  city: string;
  neighborhood: string;
  country: string;
  block?: string;
  lotName?: string;
  noNumber?: boolean;
  lotNumber?: string;
  postalCode?: string;
  uf?: string;
  propertyNumber?: string;
}
