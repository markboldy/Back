import { Request } from 'express';
import { IUser } from '../models/User/types';

export interface IAuthRequest extends Request {
  user: IUser
}
