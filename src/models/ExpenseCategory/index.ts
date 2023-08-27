import { model, Schema } from 'mongoose';
import { IExpenseCategoryDocument, IExpenseCategoryModel } from './types';

const expenseCategorySchema = new Schema<IExpenseCategoryDocument, IExpenseCategoryModel>(
  {
    name: {
      required: true,
      type: String
    }
  }
);

const ExpenseCategory = model<IExpenseCategoryDocument, IExpenseCategoryModel>('ExpenseCategory', expenseCategorySchema);

export default ExpenseCategory;
