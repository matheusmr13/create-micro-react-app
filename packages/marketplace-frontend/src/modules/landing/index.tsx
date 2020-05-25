import React from 'react';


const REDIRECT_URI = process.env.NODE_ENV === 'development' ?
  `${window.location.origin}` :
  `${window.location.origin}${process.env.PUBLIC_URL}`;

function LandingPage() {
  return (
    <div>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`}
      >
        login with github
      </a>
    </div>
  );
}

export default LandingPage;
