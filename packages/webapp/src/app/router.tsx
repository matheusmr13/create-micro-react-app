import React, { useEffect, useState } from 'react';

import { withRouter } from 'react-router-dom';
import Home from './home';
import Login from 'modules/account/login';
import { configureLoggedUser } from 'base/hooks/request';
import ReactGA from 'react-ga';
import firebase from 'modules/account/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spin } from 'antd';


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

  const [user, loading] = useAuthState(firebase.auth());
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [gaConfigured, setGaConfigured] = useState(false);

  const isTransitioning = isLoggedIn !== !!user;

  useEffect(() => {
    const exec = async () => {
      if (!gaConfigured) {
        sendPageView(history.location);
        history.listen((location: any) => {
          sendPageView(location);
        });
        setGaConfigured(true);
      }

      if (!isLoggedIn && user) {
        const idToken = await user.getIdToken();
        configureLoggedUser({
          accessToken: idToken
        });
        setLoggedIn(true);
      } else if (isLoggedIn && !user) {
        configureLoggedUser({
          accessToken: null
        });
        setLoggedIn(false);
      }
    }
    exec();
  }, [gaConfigured, user, history, loading, isLoggedIn]);

  if (loading || isTransitioning) {
    return <Spin size="large"></Spin>;
  }

  if (user) {
    return <Home />
  }

  return <Login />;
}

export default withRouter(Router);
