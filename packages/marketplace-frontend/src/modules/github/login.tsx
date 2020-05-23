import React, { useEffect } from 'react';

import useLoggedUser from 'base/hooks/user';

import { Redirect, useLocation } from 'react-router-dom';

import { useApiRequest } from 'base/hooks/request';

function Login(props: { handleLogin: Function, handleError: Function, code: string }) {
  const { handleLogin, handleError, code } = props;

  const [{ data, loading, error }, refetch] = useApiRequest({
    url: `/oauth/github?code=${code}`,
    method: 'POST',
  });

  useEffect(() => {
    if (data) {
      handleLogin(data);
      window.location.href = './';
    } else if (error) {
      handleError();
    }
  });

  return <div>Loading</div>;
}

export default Login;
