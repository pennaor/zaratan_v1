import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import TerrainCreator from '../TerrainCreator';
import TerrainEditor from '../TerrainEditor';
import Loading from '../Loading';
import Login from '../Login';
import Terrains from '../Terrains';

export default function Routes() {
  const { user, appLoading } = useApp();

  const guard = (Component: JSX.Element) => (
    user.id ? Component : <Redirect to="/login" />
  );

  if (appLoading) {
    return <Loading height="100vh" />;
  }

  return (
    <Switch>
      <Route path="/lote/editar/:id" render={() => guard(<TerrainEditor />)} />
      <Route path="/lotes/registrar" render={() => guard(<TerrainCreator />)} />
      <Route path="/lotes" render={() => guard(<Terrains />)} />
      <Route path="/login" render={() => <Login redirectUser={!!user.id} />} />
      <Route path="/" render={() => <Login redirectUser={!!user.id} />} />
    </Switch>
  );
}
