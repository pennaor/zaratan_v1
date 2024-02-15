import * as React from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import Loading from '../Loading';

type MainProps = {
  childrenIsLoading: boolean;
  children?: JSX.Element | JSX.Element[] | null | '';
};

/**
  Main é um wrapper que limita a largura
  do conteúdo da página à largura do Header
  (94% width).
*/
export default function Main({ childrenIsLoading, children }: MainProps) {
  const mainWidth = 0.94;
  return (
    <>
      <div id="back-to-top-anchor" />
      <Header
        width={mainWidth}
        shadowAppBarPosition={childrenIsLoading ? 'fixed' : 'static'}
      />
      <Box
        width={mainWidth}
        marginX="auto"
        paddingY={childrenIsLoading ? 0 : 2.5}
        component="main"
      >
        { !childrenIsLoading && children ? children : <Loading height="100vh" /> }
      </Box>
      <div id="go-to-bottom-anchor" />
    </>
  );
}
