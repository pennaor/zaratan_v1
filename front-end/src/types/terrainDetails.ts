import { ReportedEntity } from './report';

export interface ITerrainDetailsForm {
  id?: string;
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
}

export const makeTerrainDetailsForm = (): ITerrainDetailsForm => ({
  block: '',
  number: '',
  address: '',
  shape: '',
  dimensions: '',
  area: '',
  deed: '',
  deedDate: '',
  registry: '',
  observations: '',
});

export type ReportedTerrainDetails = ReportedEntity<ITerrainDetailsForm>;

export const newReportedTerrainDetails = (
  details: ITerrainDetailsForm,
): ReportedTerrainDetails => ({
  ...details,
  report: makeTerrainDetailsForm(),
});

export const lenConstraints = {
  ADDRESS: 125,
  SHAPE: 25,
  DIMENSIONS: 125,
  DEED: 125,
  REGISTRY: 125,
  OBSERVATIONS: 250,
};
