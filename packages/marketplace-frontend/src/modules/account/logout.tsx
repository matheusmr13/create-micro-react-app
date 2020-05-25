import React from 'react';
import useLoggedUser from '../../base/hooks/user';

function Logout() {
  const [auth, , clearValue] = useLoggedUser();

  if (auth) {
    clearValue();
    return <></>;
  }
  window.location.href = '/';
  return <></>;
}

export default Logout;
