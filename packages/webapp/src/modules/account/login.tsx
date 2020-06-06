import React from 'react';

import { Button, Space } from 'antd';
import { GithubFilled, GoogleCircleFilled } from '@ant-design/icons';
import './login.css';
import { message } from 'antd';
import firebase from './firebase';

function Login() {
  const handleLogin = (provider: any) => async () => {
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (e) {
      console.error(e);
      message.error('Something went wrong!');
    }
  }

  const handleGoogleLogin = handleLogin(new firebase.auth.GoogleAuthProvider());
  return (
    <div className="Login">
      <div className="Login__login-panel">
        <Space direction="vertical">
          <Button icon={<GoogleCircleFilled />} onClick={handleGoogleLogin}>Login with google</Button>
        </Space>
      </div>
    </div>
  );
}

export default Login;
