import React from 'react';
import useLoggedUser from '../../base/hooks/user';

function Logout() {
  const [auth, , clearValue] = useLoggedUser();

  if (auth) {
    clearValue();
    window.location.href = '/';
    return <></>;
  }
  return <></>;
}

export default Logout;
