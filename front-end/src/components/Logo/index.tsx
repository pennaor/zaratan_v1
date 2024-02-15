import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Grid, SvgIcon } from '@mui/material';
import { ReactComponent as LogoIcon } from '../../assets/turtle.svg';

export default function Logo({ alignItems }: { alignItems: string }) {
  return (
    <Grid
      container
      item
      xs={4}
      md={1.3}
      lg={1.3}
      xl={0.8}
      alignItems={alignItems}
      justifyContent="center"
      flexDirection="column"
      minWidth="fit-content"
    >
      <SvgIcon
        component={LogoIcon}
        inheritViewBox
        sx={{
          position: 'relative',
          top: '8px',
          fill: 'white',
          fontSize: '30px',
        }}
      />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          fontFamily: 'monospace',
          letterSpacing: '.1rem',
          color: 'black',
          textDecoration: 'none',
        }}
      >
        Zaratan
      </Typography>
    </Grid>
  );
}
