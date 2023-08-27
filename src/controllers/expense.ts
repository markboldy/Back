import requireJwtAuth from '../middleware/requireJwtAuth';
import { IAuthRequest } from '../types/request';
import { Response } from 'express';
import Joi, { ValidationResult } from 'joi';
import Group from '../models/Group';
import Member from '../models/Member';
import ExpenseCategory from '../models/ExpenseCategory';
import Expense from '../models/Expense';

interface ICreateExpenseBody {
  memberId: string;
  amount: number;
  categoryId: string;
}

const validateCreateExpenseBody = (body: ICreateExpenseBody): ValidationResult<ICreateExpenseBody> => {
  const schema = {
    memberId: Joi.string().required(),
    amount: Joi.number().required(),
    categoryId: Joi.string().required()
  };

  return Joi.validate(body, schema);
}

export const addGroupExpense = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  const { groupId } = req.params;

  const { error } = validateCreateExpenseBody(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { amount, categoryId, memberId }: ICreateExpenseBody = req.body

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const member = await Member.findOne({ _id: memberId, group: groupId });

    if (!member) {
      return res.status(404).json({ message: 'Member is not found' });
    }

    const category = await ExpenseCategory.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ message: 'Category is not found' });
    }

    const expense = await new Expense({
      debtor: memberId,
      category: categoryId,
      relatedGroup: groupId,
      amount
    }).save();

    member.expenses.push(expense._id);
    group.expenses.push(expense._id);
    member.total_spent = member.total_spent + amount;
    group.total_spent = group.total_spent + amount;

    await member.save();
    await group.save();

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}];

export const deleteGroupExpense = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  const { groupId, expenseId } = req.params;

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const expense = await Expense.findOneAndDelete({ _id: expenseId, relatedGroup: groupId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense is not found' });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}]
