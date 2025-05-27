import { ResponseData, User } from '../types';
import { client } from '../utils/custom-axios';

const UserService = {
  getProfile: async () => await client.get<ResponseData<User>>('/users/me'),

  updateProfile: async (data: Partial<User>) =>
    await client.patch('/users/me', data),

  deleteAccount: async () => await client.delete('/users/me'),
};

export default UserService;
