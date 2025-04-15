import { InterfaceAddress } from 'src/modules/address/schemas/models/address.interface';
import { InterfaceLot } from 'src/modules/address/schemas/models/lot.interface';
import { InterfaceProperty } from 'src/modules/address/schemas/models/property.interface';

export const mockCreateAddress101: InterfaceAddress = {
  city: 'Mock de Janeiro',
  uf: 'MJ',
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
  uf: 'MJ',
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
  uf: 'RJ',
  neighborhood: 'Narnia',
  country: 'Brazil',
  street: 'Rua dos Bobos',
  lotNumber: '0',
  createdAt: '2025-04-15T20:08:19.698Z',
  updatedAt: '2025-04-15T20:08:19.698Z',
};

export const mockProperty: InterfaceProperty = {
  id: 'Property1',
  lotId: 'Lote1',
  propertyNumber: '1',
  is_front: true,
  propertyConvenience: ['muito engreçada', 'feita com esmero'],
  createdAt: '2025-04-14T20:08:19.698Z',
  updatedAt: '2025-04-14T20:08:19.698Z',
};
