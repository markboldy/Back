import { Document, Model, SchemaTimestampsConfig, Types } from 'mongoose';

interface IExpense {
  debtor: Types.ObjectId;
  category: Types.ObjectId;
  relatedGroup: Types.ObjectId;
  amount: number;
}

export interface IExpenseDocument extends Document, SchemaTimestampsConfig, IExpense {}
export type IExpenseModel = Model<IExpenseDocument, {}>;
