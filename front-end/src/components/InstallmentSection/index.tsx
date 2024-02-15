import React, {
  useMemo,
} from 'react';
import { Divider, Typography, Box } from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import AssessmentIcon from '@mui/icons-material/Assessment';
import customSwal from 'customSwal';
import Installment from 'components/Installment';
import TerrainDataRow from 'components/TerrainDataRow';
import dateToBRFormat from 'utils/dateToBRFormat';
import TerrainDataSection from '../TerrainDataSection';
import { Installment as InstallmentType, SaleDetails } from '../../types/Terrain';
import currencyToString from '../../utils/currencyToString';
import TerrainDataColumn from '../TerrainDataColumn';
import './installmentSection.css';

const InstallmentAction = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light'
    ? theme.palette.grey[100]
    : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip;

interface Metrics {
  totalLeft: number;
  pendingCount: number;
  lastPaymentDate: string;
  lastPayedPrice: number;
}

interface InstallmentsMetricsProps {
  sortedInstallments: InstallmentType[];
  saleDetails: SaleDetails;
}

function InstallmentsMetrics(props: InstallmentsMetricsProps) {
  const {
    sortedInstallments,
    saleDetails,
  } = props;

  const metrics = useMemo(() => {
    const result: Metrics = {
      totalLeft: saleDetails.price,
      pendingCount: 0,
      lastPaymentDate: '',
      lastPayedPrice: 0,
    };

    let deferredCount = 0;

    for (let i = 0; i < sortedInstallments.length; i += 1) {
      const inst = sortedInstallments[i];
      if (inst.progress === 'Adiado') {
        deferredCount += 1;
      }
      if (inst.progress === 'Pendente') {
        result.pendingCount += 1;
        if (deferredCount > 0) {
          result.pendingCount += deferredCount;
          deferredCount = 0;
        }
      }
      if (inst.progress === 'Quitado') {
        deferredCount = 0;
        result.lastPaymentDate = inst.paymentDate;
        result.lastPayedPrice = inst.price;
        result.totalLeft -= inst.price;
      }
    }

    result.totalLeft = result.totalLeft > 0 ? result.totalLeft : 0;

    return result;
  }, [sortedInstallments, saleDetails]);

  return (
    <>
      <Typography
        variant="h5"
        component="div"
        padding="0.25em 0 0.85em"
      >
        Parcelamento
        <Typography
          variant="subtitle2"
          component="div"
        >
          Análise
        </Typography>
      </Typography>
      <TerrainDataColumn
        keyField="Valor de venda"
        valueField={currencyToString(saleDetails.price)}
        alignColumnAt="center"
      />
      <TerrainDataColumn
        keyField="A pagar"
        valueField={currencyToString(metrics.totalLeft)}
        alignColumnAt="center"
      />

      <Typography
        variant="h6"
        component="p"
        paddingTop="20px"
        fontWeight="400"
      >
        N° de parcelas
      </Typography>
      <TerrainDataColumn
        keyField="Pendentes / Total"
        valueField={`${metrics.pendingCount} / ${saleDetails.installmentCount}`}
        alignColumnAt="center"
      />
      <Typography
        variant="h6"
        component="p"
        paddingTop="20px"
        fontWeight="400"
      >
        Última parcela quitada
      </Typography>
      <TerrainDataRow
        keyField="Data"
        valueField={dateToBRFormat(metrics.lastPaymentDate)}
      />
      <TerrainDataRow
        keyField="Preço"
        valueField={currencyToString(metrics.lastPayedPrice)}
      />
    </>
  );
}

type ActionsProps = {
  sectionActions?: JSX.Element[];
};

function InstallmentActions({ sectionActions }: ActionsProps): JSX.Element | null {
  if (!sectionActions || !sectionActions.length) {
    return null;
  }

  return (
    <Breadcrumbs
      separator=""
      aria-label="breadcrumb"
      component="div"
      className="installment-section-actions"
    >
      {sectionActions}
    </Breadcrumbs>
  );
}

type InstallmentsSectionProps = {
  saleDetails?: SaleDetails | null;
  installments?: InstallmentType[] | null;
};

export default function InstallmentsSection(props: InstallmentsSectionProps) {
  const { saleDetails, installments } = props;

  const sortedInstallments = useMemo(() => {
    if (!installments) {
      return [];
    }

    return [...installments].sort((a, b) => {
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
  }, [installments]);

  const openMetrics = () => {
    if (!saleDetails) {
      return;
    }

    customSwal.NewMain()
      .fire({
        html: (
          <InstallmentsMetrics
            sortedInstallments={sortedInstallments}
            saleDetails={saleDetails}
          />
        ),
      });
  };

  return (
    <TerrainDataSection
      title="Parcelamento"
      contentHeight={sortedInstallments.length ? undefined : 'fit-content'}
    >
      {sortedInstallments.length ? (
        <>
          <InstallmentActions
            sectionActions={[
              <InstallmentAction
                label="Análise"
                icon={<AssessmentIcon />}
                component="button"
                onClick={openMetrics}
                key="parse-action"
              />,
            ]}
          />

          { sortedInstallments.map((installment, index) => (
            <Box key={`installment-${installment.id}`}>
              <Installment
                data={installment}
              />
              {
                index < sortedInstallments.length - 1 && (
                  <Divider
                    variant="middle"
                    sx={{
                      borderWidth: '2px',
                      borderRadius: '2px',
                      borderColor: '#38c593',
                      marginY: 3,
                    }}
                  />
                )
              }
            </Box>
          )) }
        </>
      ) : (
        <Typography
          variant="subtitle2"
          padding={1}
          textAlign="center"
          data-testid="installments-not-found"
        >
          Nenhuma parcela registrada
        </Typography>
      )}
    </TerrainDataSection>
  );
}
