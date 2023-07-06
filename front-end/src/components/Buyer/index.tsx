import React from 'react';
import { Paper } from '@mui/material';
import TerrainDataColumn from 'components/TerrainDataColumn';
import { Buyer as BuyerType } from '../../types/Terrain';
import TerrainDataRow from '../TerrainDataRow';

type Props = {
  buyer: BuyerType;
};

export default function Buyer({ buyer }: Props): JSX.Element {
  return (
    <Paper
      data-testid="buyer"
      sx={{
        my: 2,
        border: '1px solid rgba(224, 224, 224, 1)',
        borderBottom: 0,
      }}
    >
      <TerrainDataColumn
        keyField="Nome completo"
        valueField={buyer.fullName}
        testId="fullName-buyer-viewer"
      />
      <TerrainDataColumn
        keyField="CPF"
        valueField={buyer.cpf}
        testId="cpf-buyer-viewer"
      />
      <TerrainDataColumn
        keyField="CNPJ"
        valueField={buyer.cnpj}
        testId="cnpj-buyer-viewer"
      />
      <TerrainDataColumn
        keyField="Endereço"
        valueField={buyer.address}
        testId="address-buyer-viewer"
      />
      <TerrainDataRow
        keyField="Cidade"
        valueField={buyer.city}
        testId="city-buyer-viewer"
      />
      <TerrainDataRow
        keyField="Estado"
        valueField={buyer.state}
        testId="state-buyer-viewer"
      />
      <TerrainDataRow
        keyField="CEP"
        valueField={buyer.cep}
        testId="cep-buyer-viewer"
      />
      <TerrainDataRow
        keyField="Telefone"
        valueField={buyer.landLinePhone}
        testId="landLinePhone-buyer-viewer"
      />
      <TerrainDataRow
        keyField="Celular"
        valueField={buyer.mobilePhone}
        testId="mobilePhone-buyer-viewer"
      />
      <TerrainDataColumn
        keyField="E-mail"
        valueField={buyer.email}
        testId="email-buyer-viewer"
      />
    </Paper>
  );
}
