export interface InterfaceProperty {
  id?: string;
  mainAddressId: string;
  block?: string;
  propertyNumber: string;
  size?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  is_front?: boolean;
  sun?: 'morning' | 'afternoon' | 'none';
  condoPricing?: number;
  propertyConvenience?: string[];
}
