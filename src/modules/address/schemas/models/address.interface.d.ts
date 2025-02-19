import { InterfaceLot } from './lot.interface';
import { InterfaceProperty } from './property.interface';

export interface InterfaceAddress
  extends Omit<InterfaceProperty, 'id' | 'mainAddressId'>,
    Omit<InterfaceLot, 'id'> {}

export interface InterfaceSearchAddress {
  street: string;
  city: string;
  neighborhood: string;
  country: string;
  block?: string;
  lotName?: string;
  lotNumber?: string;
  postalCode?: string;
  uf?: string;
  propertyNumber?: string;
}
