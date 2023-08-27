import { Document, Model, Types } from 'mongoose';

export interface IMember {
  name: string;
  background_color: string;
  avatar: string;
  total_spent: number;
  expenses: Types.ObjectId[];
  group: Types.ObjectId;
}

export interface IMemberDocument extends Document, IMember {}

export type MemberModel = Model<IMember, {}>;


