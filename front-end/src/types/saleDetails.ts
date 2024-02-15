import { ReportedEntity } from './report';

export interface ISaleDetailsForm {
  id?: string;
  openAt: string;
  closeAt: string;
  price: string;
  downPayment: string;
  paymentType: string;
  installmentCount: string;
  progress: string;
}

export const makeSaleDetailsForm = (): ISaleDetailsForm => ({
  openAt: '',
  closeAt: '',
  price: '',
  downPayment: '',
  paymentType: '',
  installmentCount: '',
  progress: '',
});

export type ReportedSaleDetails = ReportedEntity<ISaleDetailsForm>;

export const newReportedSaleDetails = (details :ISaleDetailsForm): ReportedSaleDetails => ({
  ...details,
  report: makeSaleDetailsForm(),
});
