/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect } from 'react';
import fetchAPI from '../utils/fetchAPI';

import { AppContext } from './AppContext';

type AppProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export default function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState({
    id: 0,
    name: '',
    email: '',
  });
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    fetchAPI('GET', '/user/token')
      .then(({ data }) => setUser({ ...data }))
      .catch(() => localStorage.removeItem('_zaratan_token'))
      .finally(() => setAppLoading(false));
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, appLoading }}
    >
      { children }
    </AppContext.Provider>
  );
}
