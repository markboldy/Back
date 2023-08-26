import { Types } from 'mongoose';

export enum EUser {
  User = 'USER',
  Admin = 'ADMIN'
}

export enum EAuthProvider {
  Facebook = 'facebook',
  Google = 'google',
  Local = 'local'
}

export interface IUser {
  _id: Types.ObjectId;
  provider: EAuthProvider;
  username: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  role: EUser
  googleId?: string
  facebookId?: string
  createdAt?: string;
  updatedAt?: string;
}
