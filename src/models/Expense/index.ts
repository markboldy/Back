import mongoose from 'mongoose';
import { IExpenseModel, IExpenseDocument } from './types';

const { Schema } = mongoose;

const expenseSchema = new Schema<IExpenseDocument, IExpenseModel>(
  {
    debtor: { type: Schema.Types.ObjectId, ref: 'Member', index : true },
    category: { type: Schema.Types.ObjectId, ref: 'ExpenseCategory', index : true },
    relatedGroup: { type: Schema.Types.ObjectId, ref: 'Group', index : true },
    amount: {
      required: true,
      type: Number
    }
  }, { timestamps: true }
);

const Expense = mongoose.model<IExpenseDocument, IExpenseModel>('Expense', expenseSchema);

export default Expense;
