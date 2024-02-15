import React from 'react';
import Paper from '@mui/material/Paper';
import {
  Box, Divider, Grid, Typography,
} from '@mui/material';
import StaticStep from 'components/StaticStep';
import { TerrainForm } from 'types/form';
import TerrainOverviewSection from 'components/TerrainOverviewSection';
import TerrainDataRow from 'components/TerrainDataRow';
import TerrainDataColumn from 'components/TerrainDataColumn';
import dateToBRFormat from 'utils/dateToBRFormat';
import toBRFloatNotation from 'utils/toBRFloatNotation';
import currencyToString from 'utils/currencyToString';
import ProgressDataRow from 'components/ProgressDataRow';
import { sortByPaymentDate } from 'types/AddTerrain';
import { sortByFullName } from 'types/buyers';
import StepController from '../StepController';

interface StepOverviewProps {
  stepIndex: number;
  backStep: () => void;
  onFormSubmitHandler: () => void;
  terrain: TerrainForm;
  operationName: 'registrar' | 'atualizar';
}

export default function OverviewStep(props: StepOverviewProps) {
  const {
    stepIndex,
    backStep, onFormSubmitHandler,
    terrain, operationName,
  } = props;

  return (
    <StaticStep
      stepIndex={stepIndex}
      label="Visão geral"
      testIdSuffix="overview"
    >
      <Paper>
        <Grid
          item
          xs={12}
          sm={12}
          md={5.5}
          lg={5.5}
          xl={3.7}
          maxWidth={{ sm: '560px' }}
        >
          <TerrainOverviewSection
            title="Informações básicas"
          >
            <TerrainDataRow
              keyField="Quadra"
              valueField={terrain.details.block}
              testId="overview-block-terrain-details"
            />
            <TerrainDataRow
              keyField="Lote"
              valueField={terrain.details.number}
              testId="overview-number-terrain-details"
            />
            <TerrainDataColumn
              keyField="Endereço"
              valueField={terrain.details.address}
              testId="overview-address-terrain-details"
            />
            <TerrainDataColumn
              keyField="Escritura"
              valueField={terrain.details.deed}
              testId="overview-deed-terrain-details"
            />
            <TerrainDataRow
              keyField="Data da escritura"
              valueField={dateToBRFormat(terrain.details.deedDate)}
              testId="overview-deedDate-terrain-details"
            />
            <TerrainDataColumn
              keyField="Registro"
              valueField={terrain.details.registry}
              testId="overview-registry-terrain-details"
            />
            <TerrainDataRow
              keyField="Área"
              valueField={`${toBRFloatNotation(terrain.details.area)} m²`}
              testId="overview-area-terrain-details"
            />
            <TerrainDataColumn
              keyField="Formato"
              valueField={terrain.details.shape}
              testId="overview-shape-terrain-details"
            />
            <TerrainDataColumn
              keyField="Dimensões"
              valueField={terrain.details.dimensions}
              testId="overview-dimensions-terrain-details"
            />
            <TerrainDataColumn
              keyField="Observações"
              valueField={terrain.details.observations}
              testId="overview-observations-terrain-details"
            />
          </TerrainOverviewSection>

          <TerrainOverviewSection
            title="Venda"
          >
            {terrain.sale ? (
              <>
                <TerrainDataRow
                  keyField="Data de abertura"
                  valueField={dateToBRFormat(terrain.sale.details.openAt)}
                  testId="overview-openAt-sale-details"
                />
                <TerrainDataRow
                  keyField="Data de encerramento"
                  valueField={dateToBRFormat(terrain.sale.details.closeAt)}
                  testId="overview-closeAt-sale-details"
                />
                <TerrainDataRow
                  keyField="Preço"
                  valueField={currencyToString(Number(terrain.sale.details.price))}
                  testId="overview-price-sale-details"
                />
                <TerrainDataRow
                  keyField="Sinal"
                  valueField={currencyToString(Number(terrain.sale.details.downPayment))}
                  testId="overview-downPayment-sale-details"
                />
                <TerrainDataRow
                  keyField="Forma de pagamento"
                  valueField={terrain.sale.details.paymentType}
                  testId="overview-paymentType-sale-details"
                />
                <TerrainDataRow
                  keyField="N° de parcelas"
                  valueField={terrain.sale.details.installmentCount}
                  testId="overview-installmentCount-sale-details"
                />
                <ProgressDataRow
                  progress={terrain.sale.details.progress}
                  testId="overview-progress-sale-details"
                />
              </>
            ) : (
              <Typography
                variant="subtitle2"
                padding={1}
                textAlign="center"
                data-testid="sale-details-empty"
              >
                {`Nenhuma venda a ${operationName}`}
              </Typography>
            )}
          </TerrainOverviewSection>

          <TerrainOverviewSection
            title="Parcelamento"
          >
            {terrain.sale && terrain.sale.installments
              ? sortByPaymentDate(terrain.sale.installments)
                .map((installment, index, installments) => (
                  <Box key={`overview-installment-${installment.paymentDate}`}>
                    <Paper
                      sx={{
                        my: 2,
                        border: '1px solid rgba(224, 224, 224, 1)',
                        borderBottom: 0,
                      }}
                    >
                      <TerrainDataRow
                        keyField="Data de pagamento"
                        valueField={dateToBRFormat(installment.paymentDate)}
                        testId={`overview-paymentDate-installment-${index}`}
                      />
                      <TerrainDataRow
                        keyField="Preço"
                        valueField={currencyToString(Number(installment.price))}
                        testId={`overview-price-installment-${index}`}
                      />
                      <ProgressDataRow
                        progress={installment.progress}
                        testId={`overview-progress-installment-${index}`}
                      />
                    </Paper>
                    {index < installments.length - 1 && (
                      <Divider
                        variant="middle"
                        sx={{
                          borderWidth: '2px',
                          borderRadius: '2px',
                          borderColor: '#38c593',
                          marginY: 3,
                        }}
                      />
                    )}
                  </Box>
                )) : (
                  <Typography
                    variant="subtitle2"
                    padding={1}
                    textAlign="center"
                    data-testid="sale-installments-empty"
                  >
                    {`Nenhuma parcela a ${operationName}`}
                  </Typography>
              )}
          </TerrainOverviewSection>

          <TerrainOverviewSection
            title="Compradores"
          >
            {terrain.sale ? sortByFullName(terrain.sale.buyers).map((buyer, index, buyers) => (
              <Box key={`overview-buyer-id-${buyer.id ?? buyer.tmpId}`}>
                <Paper
                  sx={{
                    my: 2,
                    border: '1px solid rgba(224, 224, 224, 1)',
                    borderBottom: 0,
                  }}
                >
                  <TerrainDataColumn
                    keyField="Nome completo"
                    valueField={buyer.fullName}
                    testId={`overview-fullName-buyer-${index}`}
                  />
                  <TerrainDataColumn
                    keyField="CPF"
                    valueField={buyer.cpf}
                    testId={`overview-cpf-buyer-${index}`}
                  />
                  <TerrainDataColumn
                    keyField="CNPJ"
                    valueField={buyer.cnpj}
                    testId={`overview-cnpj-buyer-${index}`}
                  />
                  <TerrainDataColumn
                    keyField="Endereço"
                    valueField={buyer.address}
                    testId={`overview-address-buyer-${index}`}
                  />
                  <TerrainDataRow
                    keyField="Cidade"
                    valueField={buyer.city}
                    testId={`overview-city-buyer-${index}`}
                  />
                  <TerrainDataRow
                    keyField="Estado"
                    valueField={buyer.state}
                    testId={`overview-state-buyer-${index}`}
                  />
                  <TerrainDataRow
                    keyField="CEP"
                    valueField={buyer.cep}
                    testId={`overview-cep-buyer-${index}`}
                  />
                  <TerrainDataRow
                    keyField="Telefone"
                    valueField={buyer.landLinePhone}
                    testId={`overview-landLinePhone-buyer-${index}`}
                  />
                  <TerrainDataRow
                    keyField="Celular"
                    valueField={buyer.mobilePhone}
                    testId={`overview-mobilePhone-buyer-${index}`}
                  />
                  <TerrainDataColumn
                    keyField="E-mail"
                    valueField={buyer.email}
                    testId={`overview-email-buyer-${index}`}
                  />
                </Paper>
                {index < buyers.length - 1 && (
                  <Divider
                    variant="middle"
                    sx={{
                      borderWidth: '2px',
                      borderRadius: '2px',
                      borderColor: '#38c593',
                      marginY: 3,
                    }}
                  />
                )}
              </Box>
            )) : (
              <Typography
                variant="subtitle2"
                padding={1}
                textAlign="center"
                data-testid="sale-buyers-empty"
              >
                {`Nenhum comprador a ${operationName}`}
              </Typography>
            )}
          </TerrainOverviewSection>
        </Grid>
        <Divider />
        <StepController
          mainButton={{
            text: operationName,
            onClickHandler: onFormSubmitHandler,
            testId: 'overview-step-controller-main-button',
          }}
          secondaryButton={{
            text: 'Voltar',
            onClickHandler: backStep,
            testId: 'overview-step-controller-secondary-button',
          }}
        />
      </Paper>
    </StaticStep>
  );
}
