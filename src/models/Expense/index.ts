import mongoose, { CallbackError, Types } from 'mongoose';
import { IExpenseModel, IExpenseDocument } from './types';
import Member from '../Member';
import Group from '../Group';

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

expenseSchema.pre(['deleteOne', 'findOneAndRemove', 'remove', 'findOneAndDelete'], async function (next) {
  try {
    const expense: IExpenseDocument = await this.model.findOne(this.getQuery());

    if (!expense) {
      return next();
    }

    const member = await Member.findOne({ _id: expense.debtor });

    if (member) {
      member.expenses = member.expenses.filter(expenseId => expenseId !== expense._id);
      member.total_spent -= expense.amount;
      await member.save();
    }

    const group = await Group.findOne({ _id: expense.relatedGroup });

    if (group) {
      group.expenses = group.expenses.filter(expenseId => expenseId !== expense._id);
      group.total_spent -= expense.amount;
      await group.save();
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
})

expenseSchema.pre(['deleteMany'], async function (next) {
  try {
    const expenses: IExpenseDocument[] = await this.model.find(this.getQuery());

    if (!expenses) {
      return next();
    }

    const members = await Member.find({ _id: { $in: expenses.map(expense => expense.debtor) } });
    const groups = await Group.find({ _id: { $in: expenses.map(expense => expense.relatedGroup) } });
    const expenseByIdMap = new Map<Types.ObjectId, IExpenseDocument>(expenses.map(expense => [expense._id, expense]))

    await Promise.all([
      ...members.map(async member => {
        const spentToRemove = member.expenses.reduce<number>((acc, expenseId) => {
          const expense = expenseByIdMap.get(expenseId);

          if (expense) {
            acc += expense.amount;
          }

          return acc;
        }, 0)
        member.expenses = member.expenses.filter(expenseId => !expenseByIdMap.has(expenseId));
        member.total_spent -= spentToRemove;
        await member.save();
      }),
      ...groups.map(async group => {
        const spentToRemove = group.expenses.reduce<number>((acc, expenseId) => {
          const expense = expenseByIdMap.get(expenseId);

          if (expense) {
            acc += expense.amount;
          }

          return acc;
        }, 0);

        group.expenses = group.expenses.filter(expenseId => !expenseByIdMap.has(expenseId));
        group.total_spent -= spentToRemove;
        await group.save();
      })
    ])

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const Expense = mongoose.model<IExpenseDocument, IExpenseModel>('Expense', expenseSchema);

export default Expense;
