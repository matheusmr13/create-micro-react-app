import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Import from './import';
import Repositories from './repositories';

function GithubHome() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <Repositories />
      </Route>
      <Route path={`${match.path}/import/:owner/:repositoryName`}>
        <Import />
      </Route>
    </Switch>
  );
}

export default GithubHome;
