import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './context/AppProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);
