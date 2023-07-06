export type AddTerrainDetails = {
  block: string;
  number: string;
  address: string;
  shape: string;
  dimensions: string;
  area: string;
  deed: string;
  deedDate: string;
  registry: string;
  observations: string;
};

export type AddSaleDetails = {
  openAt: string;
  closeAt: string;
  price: string;
  downPayment: string;
  paymentType: string;
  installmentCount: string;
  progress: string;
};

export type AddInstallment = {
  price: string;
  paymentDate: string;
  progress: string;
  deferredPrice: string;
  tmpId: string;
};

export function sortByPaymentDate <T extends { paymentDate: string; }>(installments: T[]): T[] {
  return installments.sort((a, b): number => {
    const dateA = Date.parse(a.paymentDate);
    const dateB = Date.parse(b.paymentDate);
    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0;
  });
}

export type AddBuyer = {
  fullName: string;
  tmpId: string;
  cpf: string;
  cnpj: string;
  landLinePhone: string;
  mobilePhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  cep: string;
};

export type AddSale = {
  details: AddSaleDetails;
  installments: AddInstallment[] | null;
  buyers: AddBuyer[];
};

export type AddTerrain = {
  details: AddTerrainDetails;
  sale: AddSale | null;
};

export type SaleCreatorState = {
  details: AddSaleDetails;
  installments: AddInstallment[];
  buyers: AddBuyer[];
};

export type AddSaleActionTypes = 'details' | 'installments' | 'buyers';

export type AddSaleReducerAction = {
  type: AddSaleActionTypes;
  payload: SaleCreatorState | AddBuyer[] | AddSaleDetails | AddInstallment[];
};

export type AddSaleDispatch = React.Dispatch<AddSaleReducerAction>;

export type AddSaleReducer = React.Reducer<SaleCreatorState, AddSaleReducerAction>;
