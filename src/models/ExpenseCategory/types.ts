import { Document, Model } from 'mongoose';

interface IExpenseCategory {
  name: string;
}

export interface IExpenseCategoryDocument extends Document, IExpenseCategory {}
export type IExpenseCategoryModel = Model<IExpenseCategoryDocument, {}>;
