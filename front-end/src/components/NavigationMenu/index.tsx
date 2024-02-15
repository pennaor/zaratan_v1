import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuButton from '../MenuButton';
import NavigationItems from '../NavigationItems';

export default function NavigationMenu() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <MenuButton
        tip="Navegação"
        onClick={handleOpenMenu}
      >
        <MenuIcon
          htmlColor="white"
        />
      </MenuButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={Boolean(anchorElement)}
        onClose={handleCloseMenu}
        keepMounted
        sx={{
          mt: '45px',
        }}
      >
        <NavigationItems
          handleCloseMenu={handleCloseMenu}
          sx={{
            padding: 0,
            m: 0,
            minWidth: 0,
            color: 'inherit',
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
            textAlign: 'center',
          }}
        />
      </Menu>
    </>
  );
}
