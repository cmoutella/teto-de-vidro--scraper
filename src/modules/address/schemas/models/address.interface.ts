export interface InterfaceAddress {
  lotName?: string;
  street: string;
  lotNumber: string;
  postalCode?: string;
  neighborhood: string;
  city: string;
  province: string;
  country: string;
  lotConvenience?: string[];
  block?: string;
  propertyNumber?: string;
  size?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  is_front?: boolean;
  sun?: 'morning' | 'afternoon' | 'none';
  condoPricing?: number;
  propertyConvenience?: string[];
}
