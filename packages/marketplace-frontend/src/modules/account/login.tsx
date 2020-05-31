import React from 'react';

import { Layout, Button, Space } from 'antd';
import { GithubFilled, GoogleCircleFilled } from '@ant-design/icons';
import './login.css';
import { useApiRequest } from 'base/hooks/request';
import { message } from 'antd';
import firebase from './firebase';

function Login() {
  const [, oauthRequest] = useApiRequest({
    url: '/oauth',
    method: 'POST',
  }, { manual: true });

  const handleLogin = (provider: any) => async () => {
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      // const { data: loggedUser } = await oauthRequest({
      //   data: {
      //     idToken
      //   }
      // });
    } catch (e) {
      message.error('Something went wrong!');
    }
  }

  const handleGithubLogin = handleLogin(new firebase.auth.GithubAuthProvider());
  const handleGoogleLogin = handleLogin(new firebase.auth.GoogleAuthProvider());
  return (
    <div className="Login">
      <div className="Login__login-panel">
        <Space direction="vertical">
          <Button icon={<GithubFilled />} onClick={handleGithubLogin}>Login with github</Button>
          <Button icon={<GoogleCircleFilled />} onClick={handleGoogleLogin}>Login with google</Button>
        </Space>
      </div>
    </div>
  );
}

export default Login;
