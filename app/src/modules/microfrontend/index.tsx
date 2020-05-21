import React from 'react';

import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Details from './details';
import New from './new';
import List from './list';

function MicrofrontendsHome() {
  let match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={`${match.path}/new`}>
          <New />
        </Route>
        <Route path={`${match.path}/:microfrontendId`}>
          <Details />
        </Route>
        <Route path={match.path}>
          <List />
        </Route>
      </Switch>
    </div>
  );
}

export default MicrofrontendsHome;
