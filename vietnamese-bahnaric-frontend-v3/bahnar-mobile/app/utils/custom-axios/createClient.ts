import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

type CreateAxiosClientParams = {
  options: CreateAxiosDefaults;
  removeAccessToken: () => void;
  getCurrentAccessToken: () => string | null;
};

export function createClient({
  options,
  removeAccessToken: logout,
  getCurrentAccessToken,
}: CreateAxiosClientParams): AxiosInstance {
  const client: AxiosInstance = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      const token = getCurrentAccessToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (_error: any) => {
      if (_error.response.status === 401) logout();
      return Promise.reject(_error);
    }
  );

  return client;
}
