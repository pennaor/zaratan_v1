import React from 'react';
import {
  FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, InputAdornment,
} from '@mui/material';
import CashCoinIcon from 'components/CashCoinIcon';
import { ReportedSaleDetails } from 'types/saleDetails';
import removeUselessChars from 'utils/removeUselessChars';
import FieldHelperText from 'components/FieldHelperText';
import FloatTextField from 'components/FloatTextField';
import IntegerTextField from 'components/IntegerTextField';

interface SaleDetailsFormProps {
  reportedDetails: ReportedSaleDetails;
  onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChangePaymentType: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function SaleDetailsForm(props: SaleDetailsFormProps) {
  const {
    reportedDetails, onChange,
    onChangePaymentType,
  } = props;

  const onBlur = (
    ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const copy = { ...ev };
    copy.target.value = removeUselessChars(copy.target.value);
    onChange(copy);
  };

  return (
    <Grid
      container
      justifyContent="center"
      gap={2.2}
      padding={2}
    >
      <TextField
        type="date"
        name="openAt"
        label="Data de abertura"
        value={reportedDetails.openAt}
        onChange={onChange}
        error={!!reportedDetails.report.openAt}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.openAt}
            testIdPrefix="openAt-sale-details"
          />
        )}
        variant="filled"
        size="small"
        fullWidth
        InputLabelProps={{
          shrink: true,
          required: true,
          id: 'openAt-label-sale-details-form',
        }}
        inputProps={{ 'data-testid': 'openAt-input-sale-details-form' }}
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        required
      />
      <TextField
        type="date"
        name="closeAt"
        label="Data de encerramento"
        value={reportedDetails.closeAt}
        onChange={onChange}
        error={!!reportedDetails.report.closeAt}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.closeAt}
            testIdPrefix="closeAt-sale-details"
          />
        )}
        variant="filled"
        size="small"
        fullWidth
        InputLabelProps={{
          shrink: true,
          required: true,
          id: 'closeAt-label-sale-details-form',
        }}
        inputProps={{ 'data-testid': 'closeAt-input-sale-details-form' }}
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        required
      />
      <FloatTextField
        name="price"
        label="Preço"
        value={reportedDetails.price}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.price}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.price}
            testIdPrefix="price-sale-details"
          />
        )}
        InputLabelProps={{ id: 'price-label-sale-details-form' }}
        InputProps={{
          inputMode: 'numeric',
          startAdornment: (
            <InputAdornment position="start">
              R$
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <CashCoinIcon />
            </InputAdornment>
          ),
          inputProps: { 'data-testid': 'price-input-sale-details-form' },
        }}
      />
      <FloatTextField
        name="downPayment"
        label="Sinal"
        value={reportedDetails.downPayment}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.downPayment}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.downPayment}
            testIdPrefix="downPayment-sale-details"
          />
        )}
        InputLabelProps={{ id: 'downPayment-label-sale-details-form' }}
        InputProps={{
          inputMode: 'numeric',
          startAdornment: (
            <InputAdornment position="start">
              R$
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <CashCoinIcon />
            </InputAdornment>
          ),
          inputProps: { 'data-testid': 'downPayment-input-sale-details-form' },
        }}
      />
      <Grid
        container
        item
        justifyContent="center"
        rowGap={1}
        columnGap={2}
        alignItems="center"
        padding={2}
      >
        <FormControl data-testid="paymentType-content-sale-details-form">
          <FormLabel id="paymentType-title-sale-details-form">
            Forma de pagamento
          </FormLabel>
          <RadioGroup
            name="paymentType"
            value={reportedDetails.paymentType}
            aria-labelledby="paymentType-title-sale-details-form"
            onChange={onChangePaymentType}
          >
            <FormControlLabel
              label="Vista"
              value="Vista"
              data-testid="inCash-paymentType-content-sale-details-form"
              control={<Radio />}
            />
            <FormControlLabel
              label="Parcelado"
              value="Parcelado"
              data-testid="installments-paymentType-content-sale-details-form"
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
        <IntegerTextField
          name="installmentCount"
          label="N° de parcelas"
          value={reportedDetails.installmentCount}
          onChange={onChange}
          onBlur={onBlur}
          disabled={reportedDetails.paymentType !== 'Parcelado'}
          error={!!reportedDetails.report.installmentCount}
          helperText={(
            <FieldHelperText
              report={reportedDetails.report.installmentCount}
              testIdPrefix="installmentCount-sale-details"
            />
          )}
          required={reportedDetails.paymentType === 'Parcelado'}
          InputLabelProps={{ id: 'installmentCount-label-sale-details-form' }}
          InputProps={{
            inputProps: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              'data-testid': 'installmentCount-input-sale-details-form',
            },
          }}
          variant="filled"
          size="small"
          sx={{ maxWidth: '160px', alignSelf: 'flex-end', marginBottom: '0px' }}
        />
      </Grid>
      <FormControl data-testid="progress-content-sale-details-form">
        <FormLabel id="progress-title-sale-details-form">
          Progresso
        </FormLabel>
        <RadioGroup
          name="progress"
          value={reportedDetails.progress}
          onChange={onChange}
          aria-labelledby="progress-title-sale-details-form"
        >
          <FormControlLabel
            label="Aberto"
            value="Aberto"
            data-testid="open-progress-content-sale-details-form"
            control={<Radio color="warning" />}
          />
          <FormControlLabel
            label="Fechado"
            value="Fechado"
            data-testid="close-progress-content-sale-details-form"
            control={<Radio color="error" />}
          />
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
