import React, { useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
  Box, IconButton, Typography,
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import AddBoxIcon from '@mui/icons-material/AddBox';
import StaticStep from 'components/StaticStep';
import customSwal from 'customSwal';
import {
  IBuyerForm,
  ReportedBuyer,
  makeBuyerForm,
  newReportedBuyer,
  sortByFullName,
} from 'types/buyers';
import SelectBuyers from 'components/SelectBuyers';
import BuyerFormContainer from 'components/BuyerFormContainer';
import { ISaleDetailsForm } from 'types/saleDetails';
import StepController from '../StepController';
import { useFetch } from '../../hooks/useFetch';
import {
  EditSaleDispatch,
} from '../../types/form';
import './buyer-step.css';
import SwalBuyerForm from '../SwalBuyerForm';

type BuyersState = {
  fieldInvalid: boolean;
  reportedBuyers: ReportedBuyer[];
};

type EditTerrainBuyerProps = {
  stepIndex: number;
  buyers: IBuyerForm[];
  details: ISaleDetailsForm;
  submitSale: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: EditSaleDispatch;
  backStep: () => void;
  beforeRemove?: (buyerId?: string) => Promise<boolean>;
};

export default function BuyersStep(props: EditTerrainBuyerProps) {
  const {
    stepIndex,
    buyers,
    details,
    submitSale,
    dispatch,
    backStep,
    beforeRemove,
  } = props;

  const defaultState = (payload: IBuyerForm[]): BuyersState => ({
    fieldInvalid: true,
    reportedBuyers: payload.map(newReportedBuyer),
  });

  const [
    { reportedBuyers, fieldInvalid },
    setBuyersState,
  ] = useState<BuyersState>(defaultState(buyers));

  const [focusedBuyer, setFocusedBuyer] = useState('');

  const focusedRef = useRef<HTMLDivElement | null>(null);

  const {
    response,
    error,
    setFetchParams,
  } = useFetch<IBuyerForm[]>();

  const onEditBuyer = (reportedBuyer: ReportedBuyer, index: number) => {
    const handler = (incomingBuyer: ReportedBuyer) => {
      setBuyersState((prev) => {
        const copy = [...prev.reportedBuyers];
        copy[index] = incomingBuyer;
        return { fieldInvalid: prev.fieldInvalid, reportedBuyers: copy };
      });
      setFocusedBuyer(incomingBuyer.tmpId);
    };

    const swalForm = customSwal.NewForm();
    swalForm.fire({
      html: (
        <SwalBuyerForm
          saleId={Number(details.id)}
          reportedBuyer={reportedBuyer}
          index={index}
          swal={swalForm}
          buyerHandler={handler}
        />
      ),
    });
  };

  const selectBuyersCheckout = async (selectedBuyers: ReportedBuyer[]) => {
    if (selectedBuyers.length) {
      setBuyersState((prev) => ({
        fieldInvalid: prev.fieldInvalid,
        reportedBuyers: [
          ...prev.reportedBuyers,
          ...selectedBuyers,
        ],
      }));
      setFocusedBuyer(selectedBuyers[0].tmpId);
    }
  };

  const onSelectBuyer = () => {
    const swalForm = customSwal.NewForm();
    swalForm.fire({
      html: (
        <SelectBuyers
          hideBuyers={reportedBuyers}
          onCheckoutHandler={selectBuyersCheckout}
        />
      ),
      showCloseButton: true,
      customClass: {
        container: 'select-buyers-container',
      },
    });
  };

  const onAddBuyer = async () => {
    const decision = await customSwal
      .Choose(
        'Adicionar comprador...',
        'Existente',
        'Novo',
      );
    if (decision.isConfirmed) {
      onSelectBuyer();
    }
    if (decision.isDenied) {
      setBuyersState((prev) => ({
        ...prev,
        reportedBuyers: [
          ...prev.reportedBuyers,
          newReportedBuyer(makeBuyerForm()),
        ],
      }));
    }
  };

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    buyerIndex: number,
  ) => {
    const name = ev.target.name as keyof IBuyerForm;
    setBuyersState((prevState) => {
      const copy = { ...prevState };
      const buyer = copy.reportedBuyers[buyerIndex];
      buyer[name] = ev.target.value;
      return copy;
    });
  };

  const onRemove = async (buyerIndex: number) => {
    if (beforeRemove) {
      const updateState = await beforeRemove(reportedBuyers[buyerIndex].id);
      if (!updateState) {
        return;
      }
    }
    setBuyersState((prevState) => {
      const copy = { ...prevState };
      copy.reportedBuyers.splice(buyerIndex, 1);
      return copy;
    });
  };

  const onStepCheckout = () => {
    if (!reportedBuyers.length) {
      return customSwal.Error('Venda precisa possuir ao menos um comprador');
    }
    setFetchParams({
      method: 'POST',
      url: '/buyer/report',
      payload: reportedBuyers,
    });
  };

  const onSortByFullName = (buyerTmpId: string) => {
    setBuyersState((prev) => ({
      ...prev,
      reportedBuyers: sortByFullName([...prev.reportedBuyers]),
    }));
    setFocusedBuyer(buyerTmpId);
  };

  useEffect(() => {
    setBuyersState(defaultState(sortByFullName([...buyers])));
  }, [buyers]);

  useEffect(() => {
    if (!response) return;
    setBuyersState((prev) => ({ ...prev, fieldInvalid: false }));
  }, [response]);

  useEffect(() => {
    if (error && error.response) {
      const { status, data } = error.response;
      if (status === 422 && data && data.length) {
        return setBuyersState((prev) => ({
          fieldInvalid: true,
          reportedBuyers: prev.reportedBuyers.map((buyer, index) => ({
            ...buyer,
            report: data[index],
          })),
        }));
      }
      customSwal.Error();
    }
  }, [error]);

  useEffect(() => {
    if (focusedBuyer) {
      if (focusedRef.current) {
        focusedRef.current.classList.add('add-or-edit-inst-focus');
        focusedRef.current.scrollIntoView({ block: 'end' });
        setTimeout(() => focusedRef.current?.classList.remove('add-or-edit-inst-focus'), 1000);
      }
      setTimeout(() => setFocusedBuyer(''), 2000);
    }
  }, [focusedBuyer]);

  useEffect(() => {
    if (!fieldInvalid) {
      setBuyersState((prev) => defaultState(prev.reportedBuyers));
      dispatch({ type: 'buyers', payload: reportedBuyers });
      submitSale(true);
    }
  }, [fieldInvalid, reportedBuyers, dispatch, submitSale]);

  return (
    <StaticStep
      stepIndex={stepIndex}
      label="Compradores"
      testIdSuffix="buyers"
    >
      <Paper>
        {reportedBuyers.map((buyer, index) => (
          <BuyerFormContainer
            buyer={buyer}
            index={index}
            focusedRef={focusedBuyer === buyer.tmpId ? focusedRef : null}
            onEdit={buyer.id ? () => onEditBuyer(buyer, index) : undefined}
            onSort={() => onSortByFullName(buyer.tmpId)}
            onRemove={() => onRemove(index)}
            onChange={onChange}
            key={`buyer-${buyer.tmpId}`}
          />
        ))}
        <Box
          width={0.8}
          margin="auto"
          textAlign="center"
          padding="16px 16px"
        >
          <FormHelperText
            sx={{
              textAlign: 'center',
              paddingBottom: 3,
            }}
          >
            * Campos obrigatórios
          </FormHelperText>
          <IconButton
            onClick={() => onAddBuyer()}
            color="primary"
            sx={{
              fontSize: '50px',
              padding: 0,
              mr: '6px',
              cursor: 'pointer',
            }}
            data-testid="add-buyer-button"
          >
            <AddBoxIcon fontSize="inherit" />
          </IconButton>
          <Typography
            variant="button"
            component="span"
          >
            Adicionar
          </Typography>
        </Box>
        <StepController
          mainButton={{
            text: 'Próximo',
            onClickHandler: onStepCheckout,
            testId: 'buyer-step-controller-main-button',
          }}
          secondaryButton={{
            text: 'Voltar',
            onClickHandler: backStep,
            testId: 'buyer-step-controller-secondary-button',
          }}
        />
      </Paper>
    </StaticStep>
  );
}
