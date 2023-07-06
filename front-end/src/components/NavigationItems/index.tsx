import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';
import { Button, MenuItem } from '@mui/material';

/**
 * NavigationItems contém os elementos que são usados para compor o elemento de navegação
 * quando estão no formato de menu (condensados em um ícone quando largura da tela
 * menor que 900px), ou quando dispostos em linha (acima de 900px).
*/

type NavigationItemsProps = {
  sx: SxProps<Theme>;
  handleCloseMenu?: () => void;
};

function NavigationItems({ sx, handleCloseMenu = () => undefined } : NavigationItemsProps) {
  return (
    <>
      <MenuItem onClick={handleCloseMenu}>
        <Button
          component={RouterLink}
          to="/lotes"
          sx={sx}
          data-testid="terrains-anchor"
        >
          Lotes
        </Button>
      </MenuItem>
      <MenuItem onClick={handleCloseMenu}>
        <Button
          component={RouterLink}
          to="/lotes/registrar"
          sx={sx}
          data-testid="register-terrain-anchor"
        >
          Registrar
        </Button>
      </MenuItem>
    </>
  );
}

export default NavigationItems;
