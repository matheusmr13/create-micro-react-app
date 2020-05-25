import React, { useEffect } from 'react';

import { useApiRequest } from 'base/hooks/request';

function Login(props: { handleLogin: Function, handleError: Function, code: string }) {
  const { handleLogin, handleError, code } = props;

  const [{ data, error }] = useApiRequest({
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
