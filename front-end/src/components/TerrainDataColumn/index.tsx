import * as React from 'react';
import { Grid, Typography } from '@mui/material';

type SectionProps = {
  keyField: string;
  valueField: any;
  alignColumnAt?: 'flex-start' | 'center';
  testId?: string;
};

function parseValueField(value: any): any {
  if (value !== null && value !== undefined) {
    if (value.toString().length !== 0) {
      return value;
    }
  }
  return 'Não informado';
}

export default function TerrainDataColumn(props: SectionProps) {
  const {
    keyField, valueField,
    alignColumnAt = 'flex-start', testId,
  } = props;

  return (
    <Grid
      container
      wrap="nowrap"
      flexDirection="column"
      justifyContent="space-between"
      alignItems={alignColumnAt}
      sx={{
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      }}
    >
      <Typography
        noWrap
        sx={{
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '16px 16px 8px',
        }}
      >
        { keyField }
      </Typography>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '8px 16px 16px',
          textAlign: 'inherit',
          maxWidth: '99.9%',
          wordWrap: 'break-word',
        }}
        data-testid={testId}
      >
        { parseValueField(valueField) }
      </Typography>
    </Grid>
  );
}
