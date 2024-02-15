import * as React from 'react';
import Box from '@mui/material/Box';
import { Fab } from '@mui/material';
import EditSharpIcon from '@mui/icons-material/EditSharp';

interface Props {
  onEdit: () => void
}

export default function EditButton(props: Props) {
  const { onEdit } = props;

  return (
    <Box
      onClick={onEdit}
      role="presentation"
    >
      <Fab
        sx={{
          width: '35px',
          height: '35px',
          color: '#38c593',
          backgroundColor: 'transparent',
          boxShadow: 0,
          fontSize: '1.9rem',
        }}
        size="small"
        aria-label="scroll back to top"
      >
        <EditSharpIcon color="primary" fontSize="inherit" />
      </Fab>
    </Box>
  );
}
