import { makeUseAxios } from 'axios-hooks';

import Axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : 'https://microfrontend-marketplace.appspot.com/';
export const useApiRequest = makeUseAxios({
  axios: Axios.create({
    baseURL: BASE_URL,
  }),
});

export const useLoggedApiRequest = makeUseAxios({
  axios: null,
});

const configureLoggedApiRequest = (token: any) => {
  if (!token) {
    useLoggedApiRequest.configure({ axios: null });
    return;
  }
  const axios = Axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token,
    },
  });
  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      const { response } = error;
      if (response.status === 401) {
        localStorage.removeItem('auth');
        window.location.reload();
        return;
      }
      return Promise.reject(error);
    }
  );
  useLoggedApiRequest.configure({ axios });
};

export const useGithubApiRequest = makeUseAxios({
  axios: null,
});

const configureGithubApiRequest = (token: any) => {
  useGithubApiRequest.configure({
    axios: Axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    }),
  });
};

export const configureLoggedUser = (loggedUser: any) => {
  configureLoggedApiRequest(loggedUser.accessToken);
  configureGithubApiRequest('asd');
};

export { default as useApiAction } from './api-action';
