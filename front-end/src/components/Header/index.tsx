import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import {
  Container, Grid, useMediaQuery,
} from '@mui/material';
import Logo from '../Logo';
import NavigationInline from '../NavigationInline';
import UserMenu from '../UserMenu';
import AppToolbar from '../AppToolbar';

type HeaderProps = {
  width: number;
  shadowAppBarPosition: 'fixed' | 'static';
};

/**
  Alterna disposição dos elementos Logo e Nav do header
  dado breakpoint de 900px
*/
function Header({ width, shadowAppBarPosition }: HeaderProps) {
  const minWidth900 = useMediaQuery('(min-width:900px)');
  return (
    <Container // "Sombra" da barra de App. Ocupa altura da barra e dispensa margeamento
      sx={{
        height: '62px',
        position: shadowAppBarPosition,
      }}
      disableGutters
    >
      <AppBar
        position="fixed"
      >
        {
          minWidth900 ? (
            <Grid
              container
              justifyContent="center"
              width="100%"
              flexBasis="100%"
            >
              <Grid
                container
                item
                justifyContent="center"
                width={width}
                sx={{
                  maxWidth: {
                    md: '1080px',
                    xl: '1600px',
                  },
                }}
              >
                <Logo alignItems="center" />
                <NavigationInline />
                <UserMenu />
              </Grid>
            </Grid>

          ) : (
            <Grid
              container
              justifyContent="center"
              width="100%"
              flexBasis="100%"
            >
              <Grid
                container
                justifyContent="space-between"
                width={width}
                maxWidth="560px"
              >
                <AppToolbar />
                <Logo alignItems="center" />
                <UserMenu />
              </Grid>
            </Grid>
          )
        }
      </AppBar>
    </Container>
  );
}

export default Header;
