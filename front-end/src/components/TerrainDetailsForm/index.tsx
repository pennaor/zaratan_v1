import React from 'react';
import {
  Grid, TextField, InputAdornment,
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { ReportedTerrainDetails, lenConstraints } from 'types/terrainDetails';
import FieldHelperText from 'components/FieldHelperText';
import removeUselessChars from 'utils/removeUselessChars';
import FloatTextField from 'components/FloatTextField';
import IntegerTextField from 'components/IntegerTextField';

interface TerrainDetailsFormProps {
  reportedDetails: ReportedTerrainDetails;
  disableFields?: boolean;
  onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChangeDeed: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function TerrainDetailsForm(props: TerrainDetailsFormProps) {
  const {
    reportedDetails, disableFields = false,
    onChange, onChangeDeed,
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
      <IntegerTextField
        label="Quadra"
        name="block"
        value={reportedDetails.block}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.block}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.block}
            testIdPrefix="block-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'block-label-terrain-details-form' }}
        InputProps={{
          inputProps: {
            inputMode: 'numeric',
            pattern: '[0-9]*',
            'data-testid': 'block-input-terrain-details-form',
          },
        }}
        disabled={disableFields}
        required
      />
      <IntegerTextField
        name="number"
        label="Lote"
        value={reportedDetails.number}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.number}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.number}
            testIdPrefix="number-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'number-label-terrain-details-form' }}
        InputProps={{
          inputProps: {
            inputMode: 'numeric',
            pattern: '[0-9]*',
            'data-testid': 'number-input-terrain-details-form',
          },
        }}
        disabled={disableFields}
        required
      />
      <TextField
        type="text"
        name="address"
        label="Endereço"
        value={reportedDetails.address}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.address}
        helperText={(
          <FieldHelperText
            value={reportedDetails.address}
            report={reportedDetails.report.address}
            constraint={lenConstraints.ADDRESS}
            testIdPrefix="address-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'address-label-terrain-details-form' }}
        inputProps={{
          'data-testid': 'address-input-terrain-details-form',
          maxLength: lenConstraints.ADDRESS,
        }}
        multiline
        variant="outlined"
        size="medium"
        sx={{ marginTop: 3 }}
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        fullWidth
        required
      />
      <TextField
        type="text"
        name="shape"
        label="Formato"
        value={reportedDetails.shape}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.shape}
        helperText={(
          <FieldHelperText
            value={reportedDetails.shape}
            report={reportedDetails.report.shape}
            constraint={lenConstraints.SHAPE}
            testIdPrefix="shape-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'shape-label-terrain-details-form' }}
        inputProps={{
          'data-testid': 'shape-input-terrain-details-form',
          maxLength: lenConstraints.SHAPE,
        }}
        variant="filled"
        size="small"
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        fullWidth
        required
      />
      <TextField
        type="text"
        name="dimensions"
        label="Dimensões"
        value={reportedDetails.dimensions}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.dimensions}
        helperText={(
          <FieldHelperText
            value={reportedDetails.dimensions}
            report={reportedDetails.report.dimensions}
            constraint={lenConstraints.DIMENSIONS}
            testIdPrefix="dimensions-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'dimensions-label-terrain-details-form' }}
        inputProps={{
          'data-testid': 'dimensions-input-terrain-details-form',
          maxLength: lenConstraints.DIMENSIONS,
        }}
        multiline
        variant="outlined"
        size="medium"
        sx={{ marginTop: 1.65 }}
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        fullWidth
        required
      />
      <FloatTextField
        label="Área"
        name="area"
        value={reportedDetails.area}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.area}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.area}
            testIdPrefix="area-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'area-label-terrain-details-form' }}
        InputProps={{
          startAdornment: <InputAdornment position="start">m²</InputAdornment>,
          inputProps: { 'data-testid': 'area-input-terrain-details-form' },
        }}
        required
      />
      <TextField
        type="text"
        name="deed"
        label="Escritura"
        value={reportedDetails.deed}
        onChange={onChangeDeed}
        onBlur={onBlur}
        error={!!reportedDetails.report.deed}
        helperText={(
          <FieldHelperText
            value={reportedDetails.deed}
            report={reportedDetails.report.deed}
            constraint={lenConstraints.DEED}
            testIdPrefix="deed-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'deed-label-terrain-details-form' }}
        inputProps={{
          'data-testid': 'deed-input-terrain-details-form',
          maxLength: lenConstraints.DEED,
        }}
        multiline
        variant="outlined"
        size="medium"
        sx={{ marginTop: 3 }}
        fullWidth
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
      />
      <TextField
        type="date"
        name="deedDate"
        label="Data da escritura"
        value={reportedDetails.deedDate}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.deedDate}
        helperText={(
          <FieldHelperText
            report={reportedDetails.report.deedDate}
            testIdPrefix="deedDate-terrain-details"
          />
        )}
        variant="filled"
        size="small"
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        InputLabelProps={{
          shrink: true,
          required: !!reportedDetails.deed,
          id: 'deedDate-label-terrain-details-form',
        }}
        inputProps={{ 'data-testid': 'deedDate-input-terrain-details-form' }}
        fullWidth
        disabled={!reportedDetails.deed}
      />
      <TextField
        type="text"
        name="registry"
        label="Registro"
        value={reportedDetails.registry}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.registry}
        helperText={(
          <FieldHelperText
            value={reportedDetails.registry}
            report={reportedDetails.report.registry}
            constraint={lenConstraints.REGISTRY}
            testIdPrefix="registry-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'registry-label-terrain-details-form' }}
        inputProps={{
          'data-testid': 'registry-input-terrain-details-form',
          maxLength: lenConstraints.REGISTRY,
        }}
        multiline
        variant="outlined"
        size="medium"
        sx={{ marginTop: 1.65 }}
        fullWidth
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
      />
      <TextField
        type="text"
        name="observations"
        label="Observações"
        value={reportedDetails.observations}
        onChange={onChange}
        onBlur={onBlur}
        error={!!reportedDetails.report.observations}
        helperText={(
          <FieldHelperText
            value={reportedDetails.observations}
            report={reportedDetails.report.observations}
            constraint={lenConstraints.OBSERVATIONS}
            testIdPrefix="observations-terrain-details"
          />
        )}
        InputLabelProps={{ id: 'observations-label-terrain-details-form' }}
        inputProps={{
          'data-testid': 'observations-input-terrain-details-form',
          maxLength: lenConstraints.OBSERVATIONS,
        }}
        multiline
        variant="outlined"
        size="medium"
        fullWidth
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
      />
      <FormHelperText>* Campos obrigatórios</FormHelperText>
    </Grid>
  );
}
