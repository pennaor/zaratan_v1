import React, {
  useReducer, useState, useEffect,
} from 'react';
import SaleDetailsStep from 'components/SaleDetailsStep';
import { ISaleDetailsForm } from 'types/saleDetails';
import { IInstallmentForm } from 'types/installments';
import { IBuyerForm } from 'types/buyers';
import InstallmentsStep from 'components/InstallmentsStep';
import BuyersStep from 'components/BuyersStep';
import customSwal from 'customSwal';
import fetchAPI from 'utils/fetchAPI';
import { AxiosError } from 'axios';
import {
  SaleEditorState,
  EditSaleReducer,
  SaleForm,
  TerrainForm,
} from '../../types/form';

const reducer: EditSaleReducer = (state, action) => {
  switch (action.type) {
    case 'details':
      return {
        ...state,
        details: {
          ...state.details,
          ...action.payload,
          // id: state.details.id,
        } as ISaleDetailsForm,
      };
    case 'installments':
      return {
        ...state,
        installments: [...action.payload as IInstallmentForm[]],
      };
    case 'buyers':
      return {
        ...state,
        buyers: [...action.payload as IBuyerForm[]],
      };
    default:
      return state;
  }
};

const initEditorState = (initialState: SaleForm | null): SaleEditorState => {
  if (!initialState) {
    return {
      details: {
        openAt: '',
        closeAt: '',
        price: '',
        downPayment: '',
        paymentType: 'Parcelado',
        installmentCount: '2',
        progress: 'Aberto',
      },
      installments: [],
      buyers: [],
    };
  }

  const { details, buyers, installments } = initialState;
  if (installments === null) {
    return {
      details,
      buyers,
      installments: [],
    };
  }
  return {
    details,
    buyers,
    installments,
  };
};

type EditSaleProps = {
  initialState: SaleForm | null;
  stepIndex: number;
  setTerrain: React.Dispatch<React.SetStateAction<TerrainForm>>;
  nextStep: () => void;
  backStep: () => void;
};

export default function SaleEditor(props: EditSaleProps) {
  const {
    initialState,
    stepIndex,
    setTerrain,
    nextStep,
    backStep,
  } = props;

  const [sale, dispatch] = useReducer(reducer, initEditorState(initialState));

  const [submit, setSaleSubmit] = useState(false);

  const beforeRemoveBuyer = async (buyerId?: string): Promise<boolean> => {
    if (buyerId) {
      const { isDismissed } = await customSwal.Warn('Comprador já associado com a venda. Deseja diassociá-lo?');
      if (isDismissed) {
        return false;
      }
      try {
        await fetchAPI<undefined, string>('DELETE', `/sale/${sale.details.id}/buyer/${buyerId}`);
      } catch (err) {
        const error = (err as AxiosError<string>);
        if (error.response && error.response.status === 422) {
          await customSwal.Error(error.response.data);
        } else {
          await customSwal.Error('Falha ao diassociar comprador');
        }
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (submit) {
      setSaleSubmit(false);
      if (sale.installments.length > 0) {
        setTerrain((prev) => ({ ...prev, sale: { ...sale } }));
      } else {
        setTerrain((prev) => ({ ...prev, sale: { ...sale, installments: null } }));
      }
      nextStep();
    }
  }, [nextStep, sale, setTerrain, submit]);

  return sale && (
    <>
      <SaleDetailsStep
        stepIndex={stepIndex}
        details={sale.details}
        installments={sale.installments}
        dispatch={dispatch}
        nextStep={nextStep}
        backStep={backStep}
      />
      <InstallmentsStep
        stepIndex={stepIndex + 1}
        installments={sale.installments}
        details={sale.details}
        dispatch={dispatch}
        nextStep={nextStep}
        backStep={backStep}
      />
      <BuyersStep
        stepIndex={stepIndex + 2}
        buyers={sale.buyers}
        details={sale.details}
        dispatch={dispatch}
        submitSale={setSaleSubmit}
        backStep={backStep}
        beforeRemove={beforeRemoveBuyer}
      />
    </>
  );
}
