import React from 'react';
import { Paper } from '@mui/material';
import dateToBRFormat from 'utils/dateToBRFormat';
import ProgressDataRow from 'components/ProgressDataRow';
import { Installment as InstallmentType } from '../../types/Terrain';
import TerrainDataRow from '../TerrainDataRow';
import currencyToString from '../../utils/currencyToString';

type InstallmentProps = {
  data: InstallmentType;
};

export default function Installment({ data }: InstallmentProps): JSX.Element {
  const { paymentDate, price, progress } = data;

  return (
    <Paper
      data-testid="installment"
      sx={{
        my: 2,
        border: '1px solid rgba(224, 224, 224, 1)',
        borderBottom: 0,
      }}
    >
      <TerrainDataRow
        keyField="Data de pagamento"
        valueField={dateToBRFormat(paymentDate)}
        testId="paymentDate-installment-viewer"
      />
      <TerrainDataRow
        keyField="Preço"
        valueField={currencyToString(price)}
        testId="price-installment-viewer"
      />
      <ProgressDataRow
        progress={progress}
        testId="progress-installment-viewer"
      />
    </Paper>
  );
}
