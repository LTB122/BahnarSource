export type ResponseData<T> = {
  success: boolean;
  code: number;
  message: string;
  payload: T;
};

export type Region = 'binhdinh' | 'kontum' | 'gialai';

export type Translate = {
  _id?: string;
  src: string;
  tgt: string;
  isFavorite?: boolean;
  userId: string;
  createdAt: number;
  deletedAt?: number;
};

export type User = {
  _id?: string;
  name?: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  picture?: string;
  username: string;
  password: string;
  settings: {
    region: Region;
  };
  createdAt?: number;
  updatedAt?: number;
};

export type Profile = Omit<User, 'settings' | 'password'>;

export type Settings = User['settings'];
