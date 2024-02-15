import React from 'react';
import {
  FormControl, FormControlLabel, FormLabel, Radio, RadioGroup,
  Box, Grid, TextField, FormHelperText, InputAdornment,
} from '@mui/material';
import DoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CashCoinIcon from 'components/CashCoinIcon';
import { ReportedInstallment } from 'types/installments';
import removeUselessChars from 'utils/removeUselessChars';
import FieldHelperText from 'components/FieldHelperText';
import FloatTextField from 'components/FloatTextField';

interface InstallmentFormProps {
  installment: ReportedInstallment;
  index?: number;
  lastIndex?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
  onChangeProgress: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number
  ) => void;
}

export default function InstallmentForm(props: InstallmentFormProps) {
  const {
    installment, index = 0,
    lastIndex = false, onChange,
    onChangeProgress,
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
      justifyContent="center"
      gap={2.2}
    >
      <TextField
        type="date"
        name="paymentDate"
        label="Data de pagamento"
        value={installment.paymentDate}
        onChange={(ev) => onChange(ev, index)}
        error={!!installment.report.paymentDate}
        helperText={(
          <FieldHelperText
            report={installment.report.paymentDate}
            testIdPrefix={`${index + 1}-paymentDate-installment`}
          />
        )}
        disabled={!!installment.id}
        variant="filled"
        size="small"
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        InputLabelProps={{
          shrink: true,
          required: true,
          id: `paymentDate-label-installment-form-${index + 1}`,
        }}
        inputProps={{ 'data-testid': `paymentDate-input-installment-form-${index + 1}` }}
        fullWidth
        required
      />
      <FloatTextField
        index={index}
        name="price"
        label="Preço"
        value={installment.price}
        onChange={onChange}
        onBlur={onBlur}
        error={!!installment.report.price}
        helperText={(
          <FieldHelperText
            report={installment.report.price}
            testIdPrefix={`${index + 1}-price-installment`}
          />
        )}
        InputLabelProps={{ id: `price-label-installment-form-${index + 1}` }}
        InputProps={{
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
          inputProps: { 'data-testid': `price-input-installment-form-${index + 1}` },
        }}
      />
      {installment.deferredPrice && (
        <Box textAlign="center">
          <TextField
            type="text"
            label="Preço acumulado"
            value={installment.deferredPrice}
            disabled
            variant="filled"
            size="small"
            fullWidth
            InputLabelProps={{ id: `price-label-deferred-installment-form-${index + 1}` }}
            inputProps={{ 'data-testid': `price-input-deferred-installment-form-${index + 1}` }}
          />
          <FormHelperText component="span" data-testid={`deferred-info-installment-${index + 1}`}>
            {`*Soma do preço da parcela #${index + 1} com o total das parcelas adiadas`}
          </FormHelperText>
        </Box>
      )}
      <FormControl
        error={!!installment.report.progress}
        sx={{
          padding: 1,
          paddingBottom: lastIndex ? 0 : 4,
          width: 1,
          gap: 1,
          alignItems: 'center',
        }}
        data-testid={`progress-content-installment-form-${index + 1}`}
      >
        <FormLabel id={`progress-title-installment-form-${index + 1}`}>
          Progresso
        </FormLabel>
        <RadioGroup
          value={installment.progress}
          onChange={(ev) => onChangeProgress(ev, index)}
          name="progress"
          aria-labelledby={`progress-title-installment-form-${index + 1}`}
        >
          <FormControlLabel
            label="Pendente"
            value="Pendente"
            control={<Radio color="warning" />}
            data-testid={`pending-progress-content-installment-form-${index + 1}`}
          />
          <FormControlLabel
            label="Quitado"
            value="Quitado"
            control={<Radio color="error" />}
            data-testid={`settled-progress-content-installment-form-${index + 1}`}
          />
          {!lastIndex && (
            <FormControlLabel
              label="Adiado"
              value="Adiado"
              control={<Radio color="info" />}
              data-testid={`deferred-progress-content-installment-form-${index + 1}`}
            />
          )}
        </RadioGroup>

        {installment.report.progress && (
          <FormHelperText component="span" sx={{ textAlign: 'center' }}>
            {installment.report.progress}
          </FormHelperText>
        )}

        {!lastIndex && installment.progress === 'Adiado' && (
          <Box textAlign="center" paddingTop={2}>
            <DoubleArrowDownIcon
              fontSize="large"
              color="info"
              data-testid={`deferred-progress-icon-installment-form-${index}`}
            />
          </Box>
        )}
      </FormControl>
    </Grid>
  );
}
