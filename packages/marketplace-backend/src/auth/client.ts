import axios from 'axios';

export const getGithubAccessToken = (code: string) => {
  return axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
    headers: {
      accept: 'application/json',
    },
  }).then((response: any) => response.data);
};

export const getGithubUserInfo = (githubAuth: any) => {
  const { access_token, token_type } = githubAuth;
  return axios({
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `${token_type} ${access_token}`,
    },
  }).then((response: any) => response.data);
};
