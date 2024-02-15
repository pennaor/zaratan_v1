// Common

export type ValidationReport<T> = {
  validations: T;
  fieldInvalid: boolean;
};

type ValidationFieldsEntries<T> = [keyof T, string];

// Basics

// export type ValidationTerrainDetailsReport = ValidationReport<AddTerrainDetails>;

// export type ValidationTerrainDetailsEntries = ValidationFieldsEntries<AddTerrainDetails>[];

// Sale

export interface ValidateSaleFields {
  openAt: string;
  closeAt: string;
  price: string;
  downPayment: string;
  paymentType: string;
  installmentCount: string;
  progress: string;
}

export type ValidationSaleReport = ValidationReport<ValidateSaleFields>;

export type ValidationSaleEntries = ValidationFieldsEntries<ValidateSaleFields>[];

// Installments

export type ValidateInstallmentFields = {
  value: string;
  date: string;
  observations: string
};

// Buyer

// export type ValidationBuyerReport = ValidationReport<AddBuyer>;

// export type ValidationBuyerEntries = ValidationFieldsEntries<AddBuyer>[];
