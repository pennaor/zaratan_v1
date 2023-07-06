import React from 'react';
import {
  Grid, TextField,
} from '@mui/material';
import { ReportedBuyer, lenConstraints } from 'types/buyers';
import FieldHelperText from 'components/FieldHelperText';
import removeUselessChars from 'utils/removeUselessChars';

interface BuyerFieldsProps {
  buyer: ReportedBuyer;
  index?: number;
  disableFields?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => void;
}

export default function BuyerForm(props: BuyerFieldsProps) {
  const {
    buyer, index = 0,
    disableFields = false, onChange,
  } = props;

  const onBlur = (
    ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const copy = { ...ev };
    copy.target.value = removeUselessChars(copy.target.value);
    onChange(copy, index);
  };

  return (
    <Grid
      container
      item
      gap={2}
      justifyContent="center"
    >
      <TextField
        type="text"
        name="fullName"
        label="Nome completo"
        value={buyer.fullName}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        required
        error={!!buyer.report.fullName}
        helperText={(
          <FieldHelperText
            value={buyer.fullName}
            report={buyer.report.fullName}
            constraint={disableFields ? 0 : lenConstraints.FULL_NAME}
            testIdPrefix="fullName-buyer"
          />
        )}
        InputLabelProps={{ id: 'fullName-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.FULL_NAME, 'data-testid': 'fullName-input-buyer-form' }}
        fullWidth
        variant={disableFields ? 'filled' : 'outlined'}
        size="medium"
        multiline
      />
      <TextField
        type="text"
        name="cpf"
        label="CPF"
        placeholder="000.000.000-00"
        value={buyer.cpf}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields || !!buyer.cnpj}
        required={!!buyer.cpf || !buyer.cnpj}
        error={!!buyer.report.cpf}
        helperText={(
          <FieldHelperText
            value={buyer.cpf}
            report={buyer.report.cpf}
            constraint={disableFields ? 0 : lenConstraints.CPF}
            testIdPrefix="cpf-buyer"
          />
        )}
        InputLabelProps={{ id: 'cpf-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.CPF, 'data-testid': 'cpf-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="cnpj"
        label="CNPJ"
        placeholder="00.000.000/0000-00"
        value={buyer.cnpj}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields || !!buyer.cpf}
        required={!!buyer.cnpj || !buyer.cpf}
        error={!!buyer.report.cnpj}
        helperText={(
          <FieldHelperText
            value={buyer.cnpj}
            report={buyer.report.cnpj}
            constraint={disableFields ? 0 : lenConstraints.CNPJ}
            testIdPrefix="cnpj-buyer"
          />
        )}
        InputLabelProps={{ id: 'cnpj-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.CNPJ, 'data-testid': 'cnpj-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="address"
        label="Endereço"
        value={buyer.address}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.address}
        helperText={(
          <FieldHelperText
            value={buyer.address}
            report={buyer.report.address}
            constraint={disableFields ? 0 : lenConstraints.ADDRESS}
            testIdPrefix="address-buyer"
          />
        )}
        InputLabelProps={{ id: 'address-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.ADDRESS, 'data-testid': 'address-input-buyer-form' }}
        variant={disableFields ? 'filled' : 'outlined'}
        size="medium"
        multiline
        fullWidth
      />
      <TextField
        type="text"
        name="state"
        label="Estado"
        value={buyer.state}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.state}
        helperText={(
          <FieldHelperText
            value={buyer.state}
            report={buyer.report.state}
            constraint={disableFields ? 0 : lenConstraints.STATE}
            testIdPrefix="state-buyer"
          />
        )}
        InputLabelProps={{ id: 'state-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.STATE, 'data-testid': 'state-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="city"
        label="Cidade"
        value={buyer.city}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.city}
        helperText={(
          <FieldHelperText
            value={buyer.city}
            report={buyer.report.city}
            constraint={disableFields ? 0 : lenConstraints.CITY}
            testIdPrefix="city-buyer"
          />
        )}
        InputLabelProps={{ id: 'city-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.CITY, 'data-testid': 'city-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="cep"
        label="CEP"
        value={buyer.cep}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.cep}
        helperText={(
          <FieldHelperText
            value={buyer.cep}
            report={buyer.report.cep}
            constraint={disableFields ? 0 : lenConstraints.CEP}
            testIdPrefix="cep-buyer"
          />
        )}
        InputLabelProps={{ id: 'cep-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.CEP, 'data-testid': 'cep-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="mobilePhone"
        label="Celular"
        placeholder="(DDD) 90000-0000"
        value={buyer.mobilePhone}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.mobilePhone}
        helperText={(
          <FieldHelperText
            value={buyer.mobilePhone}
            report={buyer.report.mobilePhone}
            constraint={disableFields ? 0 : lenConstraints.MOBILE_PHONE}
            testIdPrefix="mobilePhone-buyer"
          />
        )}
        InputLabelProps={{ id: 'mobilePhone-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.MOBILE_PHONE, 'data-testid': 'mobilePhone-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="landLinePhone"
        label="Telefone"
        placeholder="(DDD) 0000-0000"
        value={buyer.landLinePhone}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.landLinePhone}
        helperText={(
          <FieldHelperText
            value={buyer.landLinePhone}
            report={buyer.report.landLinePhone}
            constraint={disableFields ? 0 : lenConstraints.LANDLINE_PHONE}
            testIdPrefix="landLinePhone-buyer"
          />
        )}
        InputLabelProps={{ id: 'landLinePhone-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.LANDLINE_PHONE, 'data-testid': 'landLinePhone-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        type="text"
        name="email"
        label="E-mail"
        value={buyer.email}
        onChange={(ev) => onChange(ev, index)}
        onBlur={onBlur}
        disabled={disableFields}
        error={!!buyer.report.email}
        helperText={(
          <FieldHelperText
            value={buyer.email}
            report={buyer.report.email}
            constraint={disableFields ? 0 : lenConstraints.EMAIL}
            testIdPrefix="email-buyer"
          />
        )}
        InputLabelProps={{ id: 'email-label-buyer-form' }}
        inputProps={{ maxLength: lenConstraints.EMAIL, 'data-testid': 'email-input-buyer-form' }}
        variant="filled"
        size="small"
        fullWidth
      />
    </Grid>
  );
}
