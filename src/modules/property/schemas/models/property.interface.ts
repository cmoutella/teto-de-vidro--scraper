// TODO connect to Lot in address
export interface InterfaceProperty {
  id?: string;
  mainAddressId: string;
  block?: string;
  propetyNumber: string;
  size?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  is_front?: boolean;
  sun?: 'morning' | 'afternoon' | 'none';
  condoPricing?: number;
  propetyConvenience?: string[];
}
