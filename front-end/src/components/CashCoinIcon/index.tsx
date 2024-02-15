import * as React from 'react';
import { SvgIcon } from '@mui/material';
import { ReactComponent as CashCoinSvg } from '../../assets/cash-coin.svg';

export default function CashCoinIcon() {
  return (
    <SvgIcon
      component={CashCoinSvg}
      inheritViewBox
      sx={{
        fill: '#5fbd5f',
        fontSize: '1.5rem',
      }}
    />
  );
}
