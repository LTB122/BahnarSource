import { useBoundStore, usePersistStore } from '../store';
import { ResponseData, User } from '../types';
import { client } from '../utils/custom-axios';

const AuthService = {
  signUp: async (username: string, password: string) =>
    await client.post<string>('/auth/signup', { username, password }),

  login: async (username?: string, password?: string) =>
    await client.post<
      ResponseData<{
        token: string;
      }>
    >('/auth/login', {
      username,
      password,
    }),

  logout: async () => {
    useBoundStore.getState().setProfile(null);
    usePersistStore.getState().setToken('');
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    await client.post('/auth/password', {
      oldPassword,
      newPassword,
    });
  },

  /* @deprecated */
  getUser: async () => await client.get<ResponseData<User>>('/auth/profile'),

  /* @deprecated */
  updateProfile: async (data: Partial<User>) =>
    await client.patch('/auth/profile', data),
};

export default AuthService;
