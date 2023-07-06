import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import Paper from '@mui/material/Paper';
import {
  Box, IconButton,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import StaticStep from 'components/StaticStep';
import customSwal from 'customSwal';
import BalanceError from 'components/BalanceError';
import {
  IInstallmentForm,
  ReportedInstallment,
  makeInstallmentForm,
  newReportedInstallment,
  sortByPaymentDate,
} from 'types/installments';
import { ISaleDetailsForm } from 'types/saleDetails';
import StepController from '../StepController';
import { useFetch } from '../../hooks/useFetch';
import {
  EditSaleDispatch,
} from '../../types/form';
import fetchAPI from '../../utils/fetchAPI';
import InstallmentFormContainer from '../InstallmentFormContainer';

const parseDeferredInsts = (insts: ReportedInstallment[]): ReportedInstallment[] => {
  const compensatedInsts: ReportedInstallment[] = [];
  let prices = 0;

  for (let i = 0; i < insts.length; i += 1) {
    const inst = { ...insts[i] };
    inst.deferredPrice = '';
    if (inst.progress === 'Adiado') {
      prices += Number(inst.price);
    } else if (prices > 0) {
      inst.deferredPrice = (Number(inst.price) + prices).toFixed(2);
      prices = 0;
    }
    compensatedInsts.push(inst);
  }

  return compensatedInsts;
};

type InstallmentsStepState = {
  fieldInvalid: boolean;
  reportedInstallments: ReportedInstallment[];
};

type InstallmentsStepProps = {
  installments: IInstallmentForm[];
  details: ISaleDetailsForm;
  stepIndex: number;
  backStep: () => void;
  nextStep: () => void;
  dispatch: EditSaleDispatch;
};

export default function InstallmentsStep(props: InstallmentsStepProps) {
  const {
    installments,
    details,
    stepIndex,
    backStep,
    nextStep,
    dispatch,
  } = props;

  const defaultState = (payload: IInstallmentForm[]): InstallmentsStepState => ({
    fieldInvalid: true,
    reportedInstallments: payload.map(newReportedInstallment),
  });

  const [
    { reportedInstallments, fieldInvalid },
    setInstallmentsState,
  ] = useState<InstallmentsStepState>(defaultState([]));

  const [focusedInstallment, setFocusedInstallment] = useState('');

  const focusInstallmenRef = useRef<HTMLDivElement | null>(null);

  const {
    response,
    error,
    setFetchParams,
  } = useFetch<{ overview: string, reports: IInstallmentForm[] }>();

  const saleInstallmentCount = useMemo(() => Number(details.installmentCount), [details]);

  useEffect(() => {
    if (focusedInstallment) {
      if (focusInstallmenRef.current) {
        focusInstallmenRef.current.classList.add('add-or-edit-inst-focus');
        focusInstallmenRef.current.scrollIntoView({ block: 'end' });
        setTimeout(() => focusInstallmenRef.current?.classList.remove('add-or-edit-inst-focus'), 1000);
      }
      setTimeout(() => setFocusedInstallment(''), 2000);
    }
  }, [focusedInstallment]);

  const onAddInstallment = () => {
    setInstallmentsState((prevState) => {
      const copy = { ...prevState };
      copy.reportedInstallments.push({
        price: '',
        paymentDate: '',
        progress: 'Pendente',
        deferredPrice: '',
        tmpId: String(Date.now()),
        report: makeInstallmentForm(),
      });
      return copy;
    });
  };

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    installmentIndex = 0,
  ) => {
    const name = ev.target.name as 'price' | 'paymentDate' | 'progress';
    setInstallmentsState((prevState) => {
      const copy = { ...prevState };
      const installment = copy.reportedInstallments[installmentIndex];
      installment[name] = ev.target.value;
      return copy;
    });
  };

  const onChangeProgress = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    installmentIndex: number,
  ) => {
    if (ev.target.value === 'Adiado') {
      const current = reportedInstallments[installmentIndex];
      const next = reportedInstallments[installmentIndex + 1];
      if (!current.paymentDate) {
        return customSwal.Error('Não é possível adiar parcela que não possua data válida');
      }
      if (!next.paymentDate) {
        return customSwal.Error('Não é possível adiar parcela já que a próxima não possui data válida');
      }
      if (Date.parse(current.paymentDate) > Date.parse(next.paymentDate)) {
        return customSwal.Error('Parcelas não estão ordenadas. Por favor, ordene as parcelas e tente novamente');
      }
    }
    onChange(ev, installmentIndex);
  };

  const onRemove = async (installmentIndex: number) => {
    const installment = reportedInstallments[installmentIndex];
    if (installment.id) {
      const { isDismissed } = await customSwal.Warn('Parcela já registrada. Deseja removê-la permanentemente?');
      if (isDismissed) {
        return;
      }
      try {
        await fetchAPI('DELETE', `/installment/${installment.id}`);
      } catch (_) {
        return customSwal.Error('Falha ao deletar parcela existente');
      }
    }
    setInstallmentsState((prevState) => {
      const copy = { ...prevState };
      copy.reportedInstallments.splice(installmentIndex, 1);
      return copy;
    });
  };

  const onStepCheckout = () => {
    if (saleInstallmentCount < 2) {
      dispatch({ type: 'installments', payload: [] });
      return nextStep();
    }

    if (!reportedInstallments.length) {
      return customSwal.Error('Venda parcelada. Adicione as parcelas.');
    }

    setFetchParams({
      method: 'POST',
      url: '/installment/report',
      payload: {
        installments: reportedInstallments,
        details,
      },
    });
  };

  const onSortByPaymentDate = (installmentTmpId: string) => {
    setInstallmentsState((prev) => ({
      fieldInvalid: prev.fieldInvalid,
      reportedInstallments: sortByPaymentDate([...prev.reportedInstallments]),
    }));
    setFocusedInstallment(installmentTmpId);
  };

  const onBackStep = () => {
    dispatch({ type: 'installments', payload: reportedInstallments });
    backStep();
  };

  useEffect(() => {
    setInstallmentsState(defaultState(sortByPaymentDate([...installments])));
  }, [installments]);

  useEffect(() => {
    if (!response) return;
    setInstallmentsState((prevState) => ({ ...prevState, fieldInvalid: false }));
  }, [response]);

  useEffect(() => {
    if (!error) return;

    const data = error.response?.data;
    if (!data || (!data.reports && !data.overview)) {
      customSwal.Error();
      return;
    }

    const { reports, overview } = data;

    if (reports && reports.length) {
      setInstallmentsState((prev) => {
        const updatedReports = prev.reportedInstallments.map((installment, index) => ({
          ...installment,
          report: reports[index],
        }));

        return {
          reportedInstallments: updatedReports,
          fieldInvalid: true,
        };
      });
    }

    if (overview) {
      if (overview.includes('Valor de venda difere do total do parcelamento:')) {
        customSwal.Error(<BalanceError overview={overview} />);
        return;
      }
      customSwal.Error(overview);
    }
  }, [error]);

  useEffect(() => {
    if (!fieldInvalid) {
      setInstallmentsState((prev) => defaultState(prev.reportedInstallments));
      dispatch({ type: 'installments', payload: reportedInstallments });
      nextStep();
    }
  }, [fieldInvalid, reportedInstallments, dispatch, nextStep]);

  return (
    <StaticStep
      stepIndex={stepIndex}
      label="Parcelamento"
      testIdSuffix="installments"
    >
      <Paper>
        {saleInstallmentCount > 1 && (
          <Box
            width={0.8}
            margin="auto"
            textAlign="center"
            padding="8px"
          >
            <Container
              disableGutters
              sx={{
                textAlign: 'center',
                fontSize: '1.7rem',
                paddingY: '10px',
              }}
            >
              <Typography
                component="span"
                variant="subtitle2"
                fontSize="inherit"
              >
                {reportedInstallments.length}
              </Typography>
              {' '}
              {' / '}
              {' '}
              <Typography
                component="span"
                variant="subtitle2"
                fontSize="inherit"
              >
                {details.installmentCount || '0'}
              </Typography>
            </Container>
          </Box>
        )}
        {parseDeferredInsts(reportedInstallments).map((installment, index) => (
          <InstallmentFormContainer
            installment={installment}
            index={index}
            lastIndex={index === reportedInstallments.length - 1}
            focusedInstallmentRef={
              focusedInstallment === installment.tmpId ? focusInstallmenRef : null
            }
            onRemove={() => onRemove(index)}
            onSort={() => onSortByPaymentDate(installment.tmpId)}
            onChange={onChange}
            onChangeProgress={onChangeProgress}
            key={`installment-${installment.tmpId}`}
          />
        ))}
        <Box
          width={0.8}
          margin="auto"
          textAlign="center"
          padding="16px 16px"
        >
          {saleInstallmentCount > 1 ? (
            <>
              {reportedInstallments.length > 0 && (
                <FormHelperText sx={{ textAlign: 'center', paddingBottom: 3 }}>
                  * Campos obrigatórios
                </FormHelperText>
              )}
              <IconButton
                disableRipple={
                  reportedInstallments.length === saleInstallmentCount
                }
                onClick={
                  reportedInstallments.length === saleInstallmentCount
                    ? undefined : onAddInstallment
                }
                color={
                  reportedInstallments.length === saleInstallmentCount
                    ? 'default' : 'primary'
                }
                sx={{
                  fontSize: '50px',
                  padding: 0,
                  mr: '6px',
                  cursor: reportedInstallments.length === saleInstallmentCount
                    ? 'default' : 'pointer',
                }}
                data-testid="add-installment-button"
              >
                <AddBoxIcon fontSize="inherit" />
              </IconButton>
              <Typography
                variant="button"
                component="span"
              >
                Adicionar
              </Typography>
            </>
          ) : (
            <Typography
              variant="subtitle1"
              component="span"
            >
              Venda paga a vista. Sem parcelas a registrar
            </Typography>
          )}
        </Box>
        <StepController
          mainButton={{
            text: 'Próximo',
            onClickHandler: onStepCheckout,
            testId: 'installment-step-controller-main-button',
          }}
          secondaryButton={{
            text: 'Voltar',
            onClickHandler: onBackStep,
            testId: 'installment-step-controller-secondary-button',
          }}
        />
      </Paper>
    </StaticStep>
  );
}
