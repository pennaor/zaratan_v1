import React from 'react';
import { Grid, Typography } from '@mui/material';

interface DefaultErrorProps {
  message?: string,
}

export default function DefaultError({ message }: DefaultErrorProps) {
  return (
    <Grid
      container
      wrap="nowrap"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      }}
    >
      <Typography
        sx={{
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '8px 16px 16px',
          textAlign: 'inherit',
        }}
      >
        { message ?? 'Algo falhou' }
      </Typography>
    </Grid>
  );
}
