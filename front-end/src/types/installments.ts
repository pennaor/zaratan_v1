import { ReportedEntity } from './report';

export interface IInstallmentForm {
  id?: string;
  price: string;
  paymentDate: string;
  progress: string
  deferredPrice: string;
  tmpId: string;
}

export const makeInstallmentForm = (): IInstallmentForm => ({
  price: '',
  paymentDate: '',
  progress: '',
  tmpId: '',
  deferredPrice: '',
});

export type ReportedInstallment = IInstallmentForm & ReportedEntity<IInstallmentForm>;

export const newReportedInstallment = (
  installment: IInstallmentForm,
  index?: number,
): ReportedInstallment => ({
  ...installment,
  deferredPrice: '',
  tmpId: String(Date.now() + (index ?? 0)),
  report: makeInstallmentForm(),
});

export function sortByPaymentDate<T extends IInstallmentForm>(installments: T[]): T[] {
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
