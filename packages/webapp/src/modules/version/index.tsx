import React from 'react';

import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Details from './details';
import New from './new';

function VersionsHome() {
  let match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={`${match.path}/new`}>
          <New />
        </Route>
        <Route path={`${match.path}/:versionId`}>
          <Details />
        </Route>
        {/* <Route path={match.path}><List /></Route> */}
      </Switch>
    </div>
  );
}

export default VersionsHome;
