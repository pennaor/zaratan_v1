import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';

type LoadingProps = {
  height?: string;
  margin?: string;
  iconSize?: string;
  color?: string;
};

/**
 * @prop height: string
 * - Define altura para alinhamento vertical do ícone de loading
 * @example '100%', '100vh', '100px'
 * @default '100%'
 *
 * @prop margin: string
 * - Define margem do ícone. Útil para ajustes finos do alinhamento do ícone.
 * @example '1px 1px 1px 1px'
 * @default '0px'
 */
export default function Loading(props: LoadingProps): JSX.Element {
  const {
    height = '100%',
    margin = '0px',
    color = '#38c593',
    iconSize,
  } = props;
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={height}
    >
      <CircularProgress
        size={iconSize}
        sx={{
          margin,
          color,
        }}
      />
    </Grid>
  );
}
