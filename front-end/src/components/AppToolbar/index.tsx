import * as React from 'react';
import { Grid } from '@mui/material';
import NavigationMenu from '../NavigationMenu';
import SearchButton from '../SearchButton';

export default function AppToolbar() {
  return (
    <Grid
      container
      item
      component="nav"
      xs={2.9}
      alignItems="center"
      justifyContent="flex-start"
    >
      <NavigationMenu />
      <SearchButton />
    </Grid>
  );
}
