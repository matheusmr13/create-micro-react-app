import React from 'react';

import { Layout, Button, Space } from 'antd';
import { GithubFilled, GoogleCircleFilled } from '@ant-design/icons';
import firebase from 'firebase';
import './landing.css';
import { useApiRequest } from 'base/hooks/request';

const REDIRECT_URI = process.env.NODE_ENV === 'development' ?
  `${window.location.origin}` :
  `${window.location.origin}${process.env.PUBLIC_URL}`;

const { Content } = Layout;

var firebaseConfig = {
  apiKey: "AIzaSyCLiti7ONDxcxwBswXSa4EEmwswM4AwkYQ",
  authDomain: "microfrontend-marketplace.firebaseapp.com",
  databaseURL: "https://microfrontend-marketplace.firebaseio.com",
  projectId: "microfrontend-marketplace",
  storageBucket: "microfrontend-marketplace.appspot.com",
  messagingSenderId: "256144453020",
  appId: "1:256144453020:web:0e16cc66e09142a03aec59",
  measurementId: "G-J95ZSM02PM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function LandingPage() {

  const [{ data, error }, oauthRequest] = useApiRequest({
    url: '/oauth',
    method: 'POST',
  }, { manual: true });

  const handleLogin = (provider: any) => () => {
    firebase.auth().signInWithPopup(provider).then(async function (result) {
      console.info(result);
      const idToken = await result.user?.getIdToken();
      console.info(idToken)
      oauthRequest({
        data: {
          idToken
        }
      });
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.info(error);
    });
  }

  const handleGithubLogin = handleLogin(new firebase.auth.GithubAuthProvider());
  const handleGoogleLogin = handleLogin(new firebase.auth.GoogleAuthProvider());
  return (
    <div className="LandingPage">
      <div className="LandingPage__login-panel">
        <Space direction="vertical">
          <Button icon={<GithubFilled />} onClick={handleGithubLogin}>Login with github</Button>
          <Button icon={<GoogleCircleFilled />} onClick={handleGoogleLogin}>Login with google</Button>
        </Space>
      </div>
    </div>
  );
}

export default LandingPage;
