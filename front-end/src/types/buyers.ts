import { ReportedEntity } from './report';

export interface IBuyerForm {
  id?: string;
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
}

export const makeBuyerForm = (): IBuyerForm => ({
  fullName: '',
  cpf: '',
  cnpj: '',
  landLinePhone: '',
  mobilePhone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  cep: '',
  tmpId: '',
});

export type ReportedBuyer = ReportedEntity<IBuyerForm>;

export const newReportedBuyer = (buyer: IBuyerForm, index?: number): ReportedBuyer => ({
  ...buyer,
  cpf: buyer.cpf === null ? '' : buyer.cpf,
  cnpj: buyer.cnpj === null ? '' : buyer.cnpj,
  tmpId: buyer.tmpId ? buyer.tmpId : String(Date.now() + (index ?? 0)),
  report: makeBuyerForm(),
});

export function sortByFullName<T extends { fullName: string }>(buyers: T[]): T[] {
  return buyers.sort((a, b): number => {
    if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) {
      return -1;
    }
    if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}

export const lenConstraints = {
  FULL_NAME: 80,
  CPF: 14,
  CNPJ: 18,
  ADDRESS: 125,
  CITY: 20,
  STATE: 20,
  CEP: 9,
  LANDLINE_PHONE: 15,
  MOBILE_PHONE: 16,
  EMAIL: 20,
};
