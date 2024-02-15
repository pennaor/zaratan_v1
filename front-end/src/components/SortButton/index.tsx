import * as React from 'react';
import Box from '@mui/material/Box';
import { Fab } from '@mui/material';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';

interface Props {
  onSort: () => void;
  testId?: string;
}

export default function SortButton(props: Props) {
  const { onSort, testId } = props;

  return (
    <Box
      onClick={onSort}
      role="presentation"
    >
      <Fab
        size="small"
        sx={{
          width: '35px',
          height: '35px',
          color: '#38c593',
          backgroundColor: 'transparent',
          boxShadow: 0,
          fontSize: '2rem',
        }}
      >
        <SwapVertOutlinedIcon fontSize="inherit" data-testid={testId} />
      </Fab>
    </Box>
  );
}
