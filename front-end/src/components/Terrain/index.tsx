import React from 'react';
import {
  Grid, Typography,
} from '@mui/material';
import dateToBRFormat from 'utils/dateToBRFormat';
import ProgressDataRow from 'components/ProgressDataRow';
import { sortByFullName } from 'types/buyers';
import BuyersSection from 'components/BuyersSection';
import toBRFloatNotation from 'utils/toBRFloatNotation';
import { Terrain as TerrainType } from '../../types/Terrain';
import TerrainDataSection from '../TerrainDataSection';
import TerrainDataRow from '../TerrainDataRow';
import currencyToString from '../../utils/currencyToString';
import InstallmentsSection from '../InstallmentSection';
import TerrainDataColumn from '../TerrainDataColumn';
import TerrainActionsSection from '../TerrainActionsSection';

type TerrainProps = {
  terrain: TerrainType;
};

export default function Terrain({ terrain }: TerrainProps) {
  const { details, sale } = terrain;

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={5.5}
      lg={5.5}
      xl={3.7}
      maxWidth={{ sm: '560px' }}
      data-testid={`terrain-${terrain.details.id}`}
    >
      <TerrainDataSection
        defaultExpanded
        title={(
          <>
            <Typography mr={1}>
              Quadra
              {' '}
              <Typography
                component="span"
                color="white"
                data-testid="block-terrain-details-viewer"
              >
                {details.block}
              </Typography>
            </Typography>
            <Typography mr={1}>
              •
            </Typography>
            <Typography>
              Lote
              {' '}
              <Typography
                component="span"
                color="white"
                data-testid="number-terrain-details-viewer"
              >
                {details.number}
              </Typography>
            </Typography>
          </>
        )}
      >
        <TerrainDataColumn
          keyField="Endereço"
          valueField={details.address}
          testId="address-terrain-details-viewer"
        />
        <TerrainDataColumn
          keyField="Escritura"
          valueField={details.deed}
          testId="deed-terrain-details-viewer"
        />
        <TerrainDataRow
          keyField="Data da escritura"
          valueField={dateToBRFormat(details.deedDate)}
          testId="deedDate-terrain-details-viewer"
        />
        <TerrainDataColumn
          keyField="Registro"
          valueField={details.registry}
          testId="registry-terrain-details-viewer"
        />
        <TerrainDataRow
          keyField="Área"
          valueField={`${toBRFloatNotation(String(details.area))} m²`}
          testId="area-terrain-details-viewer"
        />
        <TerrainDataColumn
          keyField="Formato"
          valueField={details.shape}
          testId="shape-terrain-details-viewer"
        />
        <TerrainDataColumn
          keyField="Dimensões"
          valueField={details.dimensions}
          testId="dimensions-terrain-details-viewer"
        />
        <TerrainDataColumn
          keyField="Observações"
          valueField={details.observations}
          testId="observations-terrain-details-viewer"
        />
      </TerrainDataSection>

      <TerrainDataSection
        title="Venda"
        contentHeight={sale ? undefined : 'fit-content'}
      >
        { sale ? (
          <>
            <TerrainDataRow
              keyField="Data de abertura"
              valueField={dateToBRFormat(sale.details.openAt)}
              testId="openAt-sale-details-viewer"
            />
            <TerrainDataRow
              keyField="Data de fechamento"
              valueField={dateToBRFormat(sale.details.closeAt)}
              testId="closeAt-sale-details-viewer"
            />
            <TerrainDataRow
              keyField="Preço"
              valueField={currencyToString(sale.details.price)}
              testId="price-sale-details-viewer"
            />
            <TerrainDataRow
              keyField="Sinal"
              valueField={currencyToString(sale.details.downPayment)}
              testId="downPayment-sale-details-viewer"
            />
            <TerrainDataRow
              keyField="Forma de pagamento"
              valueField={sale.details.paymentType}
              testId="paymentType-sale-details-viewer"
            />
            <TerrainDataRow
              keyField="N° de parcelas"
              valueField={sale.details.installmentCount}
              testId="installmentCount-sale-details-viewer"
            />
            <ProgressDataRow
              progress={sale.details.progress}
              testId="progress-sale-details-viewer"
            />
          </>
        ) : (
          <Typography
            variant="subtitle2"
            padding={1}
            textAlign="center"
            data-testid="sale-details-not-found"
          >
            Nenhuma venda registrada
          </Typography>
        ) }
      </TerrainDataSection>

      <InstallmentsSection
        installments={sale?.installments}
        saleDetails={sale?.details}
      />

      <BuyersSection buyers={sale ? sortByFullName(sale.buyers) : []} />

      <TerrainActionsSection
        id={details.id}
        block={details.block}
        number={details.number}
      />
    </Grid>
  );
}
