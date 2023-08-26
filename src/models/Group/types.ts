import { Model, Types, Document } from 'mongoose';
import { ECurrencies } from '../../types/base';

export interface IGroup {
  creator: Types.ObjectId;
  name: string;
  background_color: string;
  currency: ECurrencies;
  members: Types.ObjectId[];
  members_total: number;
  expenses: Types.ObjectId[];
  total_spent: number;
}

export interface IGroupDocument extends Document, IGroup {}

export type GroupModel = Model<IGroup, {}>;
