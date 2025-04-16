export interface InterfaceLot {
  id?: string;
  lotName?: string;
  street: string;
  noNumber: boolean;
  lotNumber: string;
  postalCode?: string;
  neighborhood: string;
  city: string;
  uf: string;
  country: string;
  lotConvenience?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InterfaceSearchLot {
  street: string;
  lotNumber?: string;
  noNumber?: boolean;
  block?: string;
  postalCode?: string;
  neighborhood?: string;
  city: string;
  uf: string;
  country: string;
}
