import * as React from 'react';
import { Grid, Typography } from '@mui/material';

function parseValueField(value: any): any {
  if (value !== null && value !== undefined) {
    if (value.toString().length !== 0) {
      return value;
    }
  }
  return 'Não informado';
}

type SectionProps = {
  keyField: string
  valueField: any;
  testId?: string;
};

export default function TerrainDataRow({ keyField, valueField, testId }: SectionProps) {
  return (
    <Grid
      container
      wrap="nowrap"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '16px',
        }}
      >
        { keyField }
      </Typography>
      <Typography
        data-testid={testId}
        sx={{
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '16px',
          textAlign: 'end',
          maxWidth: '99.9%',
          wordWrap: 'break-word',
        }}
      >
        { parseValueField(valueField) }
      </Typography>
    </Grid>
  );
}
