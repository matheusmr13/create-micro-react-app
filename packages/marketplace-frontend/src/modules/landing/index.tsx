import React from 'react';

function LandingPage() {
  return (
    <div>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/login`}
      >
        login with github
      </a>
    </div>
  );
}

export default LandingPage;
