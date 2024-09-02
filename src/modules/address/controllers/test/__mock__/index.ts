import { InterfaceAddress } from 'src/modules/address/schemas/models/address.interface';
import { InterfaceLot } from 'src/modules/address/schemas/models/lot.interface';
import { InterfaceProperty } from 'src/modules/address/schemas/models/property.interface';

export const mockCreateAddress101: InterfaceAddress = {
  city: 'Mock de Janeiro',
  province: 'MJ',
  country: 'Brazil',
  neighborhood: 'Narnia',
  street: 'Rua dos Bobos',
  lotNumber: '0',
  propertyNumber: '1',
  is_front: true,
  propertyConvenience: ['muito engreçada', 'feita com esmero'],
};

export const mockCreateAddress102: InterfaceAddress = {
  city: 'Mock de Janeiro',
  province: 'MJ',
  country: 'Brazil',
  neighborhood: 'Narnia',
  street: 'Rua dos Bobos',
  lotNumber: '0',
  propertyNumber: '2',
  is_front: true,
  propertyConvenience: ['muito engreçada', 'feita com esmero'],
};

export const mockLot: InterfaceLot = {
  id: 'Lote1',
  city: 'Mock de Janeiro',
  province: 'MJ',
  neighborhood: 'Narnia',
  country: 'Brazil',
  street: 'Rua dos Bobos',
  lotNumber: '0',
};

export const mockProperty: InterfaceProperty = {
  id: 'Property1',
  mainAddressId: 'Lote1',
  propertyNumber: '1',
  is_front: true,
  propertyConvenience: ['muito engreçada', 'feita com esmero'],
};
