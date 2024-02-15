import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Routes from './components/Routes';
import './App.css';
import './customSwal/style.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#38c593',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
