import React from 'react';
import {
  Grid, Typography,
} from '@mui/material';

type Props = {
  progress: string;
  testId?: string
};

export default function ProgressDataRow({ progress, testId }: Props) {
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
        Progresso
      </Typography>
      <Typography
        color={
          progress === 'Aberto' || progress === 'Pendente'
            ? '#ed6c02' : '#d32f2f'
        }
        sx={{
          fontSize: '0.95rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '16px',
          textAlign: 'end',
        }}
        data-testid={testId}
      >
        { progress }
      </Typography>
    </Grid>
  );
}
