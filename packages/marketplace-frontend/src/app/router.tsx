import React, { useEffect, useState } from 'react';

import { Redirect, withRouter } from 'react-router-dom';
import Home from './home';
import Login from 'modules/account/login';
import { configureLoggedUser } from 'base/hooks/request';
import ReactGA from 'react-ga';
import firebase from 'modules/account/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spin } from 'antd';

const LANDING_PAGE_URL = '/';
const LOGGED_HOME_URL = '/home';

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

  const [user, loading, error] = useAuthState(firebase.auth());
  const [requestConfigured, setRequestConfigured] = useState(false);
  const [gaConfigured, setGaConfigured] = useState(false);

  useEffect(() => {
    const exec = async () => {
      if (!gaConfigured) {
        sendPageView(history.location);
        history.listen((location: any) => {
          sendPageView(location);
        });
        setGaConfigured(true);
      }

      if (!requestConfigured && user) {
        const idToken = await user.getIdToken();
        configureLoggedUser({
          accessToken: idToken
        });
        setRequestConfigured(true);
      }
    }
    exec();
  }, [gaConfigured, requestConfigured, user]);

  if (loading || !requestConfigured) {
    return <Spin size="large"></Spin>;
  }

  if (user) {
    return <Home />
  }

  return <Login />;
}

export default withRouter(Router);
