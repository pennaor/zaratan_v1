import React from 'react';
import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface Props {
  onRemove: () => void;
  testId?: string;
}

export default function RemoveButton(props: Props) {
  const { onRemove, testId } = props;

  return (
    <IconButton
      onClick={onRemove}
      color="primary"
      data-testid={testId}
      sx={{
        padding: 0,
        fontSize: '24px',
        width: 'fit-content',
        height: 'fit-content',
        verticalAlign: 'top',
        ml: 0.5,
      }}
    >
      <HighlightOffIcon fontSize="inherit" />
    </IconButton>
  );
}
