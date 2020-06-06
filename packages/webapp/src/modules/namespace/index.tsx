import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { Details, New } from './details';
import Deploy from './deploy';

function ApplicationHome() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <New />
      </Route>
      <Route path={`${match.path}/:namespaceId/deploy/next`}>
        <Deploy />
      </Route>
      <Route path={`${match.path}/:namespaceId`}>
        <Details />
      </Route>
    </Switch>
  );
}

export default ApplicationHome;
