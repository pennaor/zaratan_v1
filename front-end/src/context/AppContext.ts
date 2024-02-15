import { createContext, useContext } from 'react';

export type User = {
  id: number;
  name: string;
  email: string;
};

type SetUser = React.Dispatch<React.SetStateAction<User>>;

export interface AppContextInterface {
  user: User;
  setUser: SetUser;
  appLoading: boolean;
}

export const AppContextInitialState: AppContextInterface = {
  user: {
    id: 0,
    name: '',
    email: '',
  },
  setUser: () => null,
  appLoading: true,
};

export const AppContext = createContext<AppContextInterface>(AppContextInitialState);

export const useApp = () => useContext(AppContext);
