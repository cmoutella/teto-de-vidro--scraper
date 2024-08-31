export interface InterfaceLot {
  id?: string;
  name?: string;
  street: string;
  lotNumber: string;
  postalCode?: string;
  neighborhood: string;
  city: string;
  province: string;
  country: string;
  lotConvenience?: string[];
}

export interface InterfaceSearchLot {
  street: string;
  lotNumber?: string;
  postalCode?: string;
  neighborhood?: string;
  city: string;
  province: string;
  country: string;
}
