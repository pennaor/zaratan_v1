import { IBuyerForm } from './buyers';
import { IInstallmentForm } from './installments';
import { ISaleDetailsForm } from './saleDetails';
import { ITerrainDetailsForm } from './terrainDetails';

export type SaleForm = {
  details: ISaleDetailsForm;
  installments: IInstallmentForm[] | null;
  buyers: IBuyerForm[];
};

export type TerrainForm = {
  details: ITerrainDetailsForm;
  sale: SaleForm | null;
};

export type SaleEditorState = {
  details: ISaleDetailsForm;
  installments: IInstallmentForm[];
  buyers: IBuyerForm[];
};

export type EditSaleActionTypes = 'details' | 'installments' | 'buyers';

export type EditSaleReducerAction = {
  type: EditSaleActionTypes;
  payload: SaleEditorState | ISaleDetailsForm | IInstallmentForm[] | IBuyerForm[]
};

export type EditSaleDispatch = React.Dispatch<EditSaleReducerAction>;

export type EditSaleReducer = React.Reducer<SaleEditorState, EditSaleReducerAction>;
