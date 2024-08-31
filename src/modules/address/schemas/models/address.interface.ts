import { InterfaceLot } from './lot.interface';
import { InterfaceProperty } from './property.interface';

export interface InterfaceAddress
  extends Omit<InterfaceProperty, 'id' | 'mainAddressId'>,
    Omit<InterfaceLot, 'id'> {}
