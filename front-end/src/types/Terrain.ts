export interface SaleDetails {
  id: number;
  terrainId: number;
  openAt: string;
  closeAt: string;
  price: number;
  downPayment: number;
  paymentType: string;
  installmentCount: number;
  progress: string;
}

export interface Installment {
  id: number;
  saleId: number;
  price: number;
  paymentDate: string;
  progress: string
}

export interface Buyer {
  id: number;
  fullName: string;
  cpf: string | null;
  cnpj: string | null;
  email: string | null;
  landLinePhone: string;
  mobilePhone: string;
  address: string;
  city: string;
  state: string;
  cep: string;
}

export interface Sale {
  details: SaleDetails;
  buyers: Buyer[]
  installments: Installment[] | null
}

export interface TerrainDetails {
  id: number;
  block: number;
  number: number;
  address: string;
  shape: string;
  dimensions: string;
  area: number;
  deed: string;
  deedDate: string | null;
  registry: string;
  observations: string;
}

export interface Terrain {
  details: TerrainDetails;
  sale: Sale | null;
}
