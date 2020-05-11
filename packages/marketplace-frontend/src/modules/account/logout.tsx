import React from 'react';
import useLoggedUser from '../../base/hooks/user';
import { Redirect } from 'react-router-dom';

function Logout() {
  const [auth, _, clearValue] = useLoggedUser();

  if (auth) {
    clearValue();
    return <></>;
  }
  window.location.href = '/';
  return <></>;
}

export default Logout;
