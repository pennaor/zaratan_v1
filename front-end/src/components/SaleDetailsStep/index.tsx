import React, {
  useState, useEffect,
} from 'react';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import StaticStep from 'components/StaticStep';
import customSwal from 'customSwal';
import {
  ISaleDetailsForm, ReportedSaleDetails, newReportedSaleDetails,
} from 'types/saleDetails';
import { IInstallmentForm } from 'types/installments';
import SaleDetailsForm from 'components/SaleDetailsForm';
import fetchAPI from 'utils/fetchAPI';
import StepController from '../StepController';
import {
  AddSaleDispatch,
} from '../../types/AddTerrain';
import { useFetch } from '../../hooks/useFetch';

type SaleDetailsState = {
  fieldInvalid: boolean;
  reportedDetails: ReportedSaleDetails;
};

type SaleDetailsStepProps = {
  installments: IInstallmentForm[];
  stepIndex: number;
  details: ISaleDetailsForm;
  nextStep: () => void;
  backStep: () => void;
  dispatch: AddSaleDispatch;
};

export default function SaleDetailsStep(props: SaleDetailsStepProps) {
  const {
    installments,
    stepIndex,
    details,
    nextStep,
    backStep,
    dispatch,
  } = props;

  const defaultState = (saleDetails: ISaleDetailsForm): SaleDetailsState => ({
    fieldInvalid: true,
    reportedDetails: newReportedSaleDetails(saleDetails),
  });

  const [
    { fieldInvalid, reportedDetails },
    setForm,
  ] = useState<SaleDetailsState>(defaultState(details));

  const { response, error, setFetchParams } = useFetch<ISaleDetailsForm>();

  const onStepCheckout = () => {
    setFetchParams({
      method: 'POST',
      url: '/sale/details/report',
      payload: {
        ...reportedDetails,
      },
    });
  };

  const onChangePaymentType = async (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let { installmentCount } = reportedDetails;

    if (reportedDetails.paymentType === 'Parcelado') {
      installmentCount = '0';
      if (installments.length) {
        const decision = await customSwal
          .Warn('Ao escolher pagar a vista, TODAS as parcelas inseridas ou já CADASTRADAS serão removidas. Deseja prosseguir?');

        if (decision.isDismissed) return;

        if (details && details.id) {
          if (installments.some(({ id }) => !!id)) {
            try {
              await fetchAPI('DELETE', `/installment/sale/${details.id}`);
            } catch (_) {
              return customSwal.Error('Falha ao deletar parcela(s)');
            }
          }
        }
        dispatch({ type: 'installments', payload: [] });
      }
    } else {
      installmentCount = '2';
    }

    setForm((prev) => ({
      fieldInvalid: prev.fieldInvalid,
      reportedDetails: {
        ...reportedDetails,
        paymentType: ev.target.value,
        installmentCount,
      },
    }));
  };

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = ev.target.name as keyof ISaleDetailsForm;
    setForm((prev) => ({
      fieldInvalid: prev.fieldInvalid,
      reportedDetails: {
        ...prev.reportedDetails,
        [name]: ev.target.value,
      },
    }));
  };

  useEffect(() => {
    if (!response) return;
    setForm((prev) => ({ reportedDetails: prev.reportedDetails, fieldInvalid: false }));
  }, [response]);

  useEffect(() => {
    if (!error) return;

    const data = error.response?.data;
    if (data) {
      return setForm((prev) => ({
        fieldInvalid: true,
        reportedDetails: {
          ...prev.reportedDetails,
          report: data,
        },
      }));
    }

    customSwal.Error();
  }, [error]);

  useEffect(() => {
    if (!fieldInvalid) {
      setForm((prev) => defaultState(prev.reportedDetails));
      dispatch({ type: 'details', payload: reportedDetails });
      nextStep();
    }
  }, [dispatch, nextStep, fieldInvalid, reportedDetails]);

  return (
    <StaticStep
      stepIndex={stepIndex}
      label="Venda"
      testIdSuffix="sale-details"
    >
      <Paper>
        <SaleDetailsForm
          reportedDetails={reportedDetails}
          onChange={onChange}
          onChangePaymentType={onChangePaymentType}
        />
        <FormHelperText
          sx={{
            padding: 2,
            textAlign: 'center',
          }}
        >
          * Campos obrigatórios
        </FormHelperText>
        <StepController
          mainButton={{
            text: 'Próximo',
            onClickHandler: onStepCheckout,
            testId: 'sale-details-step-controller-main-button',
          }}
          secondaryButton={{
            text: 'Voltar',
            onClickHandler: backStep,
            testId: 'sale-details-step-controller-secondary-button',
          }}
        />
      </Paper>

    </StaticStep>

  );
}
