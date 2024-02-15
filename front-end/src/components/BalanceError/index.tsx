import React from 'react';
import { Grid, Typography } from '@mui/material';
import currencyToString from 'utils/currencyToString';
import DefaultError from 'components/DefaultError';

interface BalanceProps {
  overview: string;
}

export default function BalanceError({ overview }: BalanceProps) {
  const error = <DefaultError message="Algo deu errado" />;

  const [message, values] = overview.split(':');
  if (!message || !values) {
    return error;
  }

  const [salePrice, totalInstallmentsPrice] = values.split('|');
  if (!salePrice || !totalInstallmentsPrice) {
    return error;
  }

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
          fontWeight: 700,
          fontSize: '1rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          padding: '16px',
        }}
      >
        {message}
      </Typography>
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
          Venda
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
            padding: '16px',
            textAlign: 'end',
          }}
        >
          { currencyToString(Number(salePrice)) }
        </Typography>
      </Grid>
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
          Parcelamento
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
            padding: '16px',
            textAlign: 'end',
          }}
        >
          { currencyToString(Number(totalInstallmentsPrice)) }
        </Typography>
      </Grid>
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
            letterSpacing: '0.1em',
            padding: '16px',
          }}
        >
          V - P
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
            padding: '16px',
            textAlign: 'end',
          }}
        >
          { currencyToString(Number(salePrice) - Number(totalInstallmentsPrice)) }
        </Typography>
      </Grid>
    </Grid>
  );
}
