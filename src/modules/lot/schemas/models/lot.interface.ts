export interface InterfaceLot {
  id?: string;
  name?: string;
  street: string;
  number: string;
  postalCode?: string;
  neighborhood: string;
  city: string;
  province: string;
  country: string;
  convenience?: string[];
}

export interface InterfaceSearchLot {
  street: string;
  number?: string;
  postalCode?: string;
  neighborhood?: string;
  city: string;
  province: string;
  country: string;
}
