import React, {
  useReducer, useState, useEffect,
} from 'react';
import {
  AddBuyer, AddInstallment, AddSaleDetails, AddSaleReducer, AddTerrain, SaleCreatorState,
} from 'types/AddTerrain';
import SaleDetailsStep from 'components/SaleDetailsStep';
import InstallmentsStep from 'components/InstallmentsStep';
import BuyersStep from 'components/BuyersStep';

const reducer: AddSaleReducer = (state, action) => {
  switch (action.type) {
    case 'details':
      return {
        ...state,
        details: {
          ...state.details,
          ...action.payload,
          // id: state.details.id,
        } as AddSaleDetails,
      };
    case 'installments':
      return {
        ...state,
        installments: [...action.payload as AddInstallment[]],
      };
    case 'buyers':
      return {
        ...state,
        buyers: [...action.payload as AddBuyer[]],
      };
    default:
      return state;
  }
};

const initCreatorState = (): SaleCreatorState => ({
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
});

type AddSaleProps = {
  stepIndex: number;
  setTerrain: React.Dispatch<React.SetStateAction<AddTerrain>>;
  nextStep: () => void;
  backStep: () => void;
};

export default function SaleCreator(props: AddSaleProps) {
  const {
    stepIndex,
    setTerrain,
    nextStep,
    backStep,
  } = props;

  const [sale, dispatch] = useReducer(reducer, initCreatorState());

  const [submit, setSaleSubmit] = useState(false);

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
      />
    </>
  );
}
