import React, { useState, useEffect } from 'react';

import { Switch, Route, useHistory, Redirect, withRouter } from 'react-router-dom';
import Home from './home';
import Login from 'modules/github/login';
import Logout from 'modules/account/logout';
import LandingPage from 'modules/landing';
import useLoggedUser from 'base/hooks/user';
import { configureLoggedUser } from 'base/hooks/request';
import ReactGA from 'react-ga';

const LANDING_PAGE_URL = '/';
const LOGGED_HOME_URL = '/home';

const NotLoggedIn = () => {
  const [loggedUser, setLoggedUser] = useLoggedUser();
  const history = useHistory();
  const code = window.location.search.split('=')[1];

  if (loggedUser) {
    return <Redirect to={LOGGED_HOME_URL} />;
  }

  if (code) {
    return <Login handleLogin={setLoggedUser} handleError={() => history.push('/')} code={code} />;
  }

  return <LandingPage />
}

const LoggedIn = () => {
  const [loggedUser] = useLoggedUser();
  const [requestConfigured, setRequestConfigured] = useState(false);

  if (!loggedUser) {
    return <Redirect to={LANDING_PAGE_URL} />;
  }

  if (!requestConfigured) {
    configureLoggedUser(loggedUser);
    setRequestConfigured(true);
  }

  return <Home />
}

if (process.env.NODE_ENV !== 'development') {
  ReactGA.initialize('UA-167556761-1');
}
const sendPageView = (location: any) => {
  if (process.env.NODE_ENV !== 'development') {
    ReactGA.pageview(location.pathname + location.search);
  }
}

function Router(props: { history: any }) {
  const { history } = props;

  useEffect(() => {
    sendPageView(history.location);
    history.listen((location: any) => {
      sendPageView(location);
    });
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <NotLoggedIn />
      </Route>
      <Route path="/home">
        <LoggedIn />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
    </Switch>
  );
}

export default withRouter(Router);
