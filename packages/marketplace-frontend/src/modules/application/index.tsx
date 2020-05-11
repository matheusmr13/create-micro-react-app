import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Details from './details';
import List from './list';
import Deploy from './deploy';

function ApplicationHome() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:applicationId/deploy`}>
        <Deploy />
      </Route>
      <Route path={`${match.path}/:applicationId`}>
        <Details />
      </Route>
      <Route path={match.path}>
        <List />
      </Route>
    </Switch>
  );
}

export default ApplicationHome;
