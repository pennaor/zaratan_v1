import * as React from 'react';
import { Grid, List } from '@mui/material';
import NavigationItems from '../NavigationItems';

export default function NavigationInline() {
  return (
    <Grid
      container
      item
      component="nav"
      md={5}
      lg={4.9}
      xl={4.5}
      gap={3}
      alignItems="center"
      justifyContent="flex-start"
    >
      <List
        disablePadding
        sx={{
          display: 'flex',
        }}
      >
        <NavigationItems
          sx={{
            color: 'white',
            padding: 0,
            m: 0,
            minWidth: 0,
          }}
        />
      </List>
    </Grid>
  );
}
