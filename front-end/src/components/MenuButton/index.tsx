import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface MenuIconProps {
  tip: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  children: JSX.Element;
}

export default function MenuButton({ tip, onClick, children }: MenuIconProps) {
  return (
    <Tooltip
      title={tip}
    >
      <IconButton
        onClick={onClick}
        sx={{
          p: 0,
          height: '40px',
        }}
      >
        { children }
      </IconButton>
    </Tooltip>
  );
}
