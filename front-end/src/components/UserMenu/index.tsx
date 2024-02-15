import React from 'react';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import MenuButton from '../MenuButton';
import { useApp } from '../../context/AppContext';

export default function UserMenu() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);

  const { user } = useApp();

  const history = useHistory();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  const logout = () => {
    localStorage.removeItem('_zaratan_token');
    history.go(0);
  };

  return (
    <Grid
      container
      item
      xs={2.6}
      md={5.2}
      lg={5.1}
      xl={6.3}
      alignItems="center"
      justifyContent="flex-end"
    >
      <MenuButton
        tip={`Opções de ${user.name}`}
        onClick={handleOpenMenu}
        data-testid="user-options-menu-button"
      >
        <Avatar alt={user.name} src="src" />
      </MenuButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElement)}
        onClose={handleCloseMenu}
        keepMounted
        sx={{ mt: '45px' }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Typography
            textAlign="center"
            onClick={logout}
            data-testid="user-options-logout"
          >
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Grid>
  );
}
