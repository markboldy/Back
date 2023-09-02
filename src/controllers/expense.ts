import requireJwtAuth from '../middleware/requireJwtAuth';
import { IAuthRequest } from '../types/request';
import { Response } from 'express';
import Joi, { ValidationResult } from 'joi';
import Group from '../models/Group';
import Member from '../models/Member';
import ExpenseCategory from '../models/ExpenseCategory';
import Expense from '../models/Expense';
import { sanitizeObject } from '../utils/utils';
import { Types } from 'mongoose';

interface ICreateExpenseBody {
  memberId: Types.ObjectId;
  amount: number;
  categoryId: Types.ObjectId;
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

interface IUpdateExpenseBody {
  memberId?: Types.ObjectId;
  amount?: number;
  categoryId?: Types.ObjectId;
}

const validateUpdateExpenseBody = (body: IUpdateExpenseBody): ValidationResult<IUpdateExpenseBody> => {
  const schema = {
    memberId: Joi.string(),
    amount: Joi.number(),
    categoryId: Joi.string()
  };

  return Joi.validate(body, schema);
}

export const updateGroupExpense = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  const { groupId, expenseId } = req.params;
  const { error } = validateUpdateExpenseBody(req.body);
  const { memberId, amount, categoryId }: IUpdateExpenseBody = req.body;

  if ((!memberId && !amount && !categoryId) || error) {
    return res.status(400).json({ message: error ? error.details[0].message : "Valid body fields weren't provided" });
  }

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    if (categoryId) {
      const category = await ExpenseCategory.findOne({ _id: categoryId });

      if (!category) {
        return res.status(404).json({ message: 'Category is not found' });
      }
    }

    const payloadToUpdateExpense = sanitizeObject({
      debtor: memberId,
      amount,
      category: categoryId
    })

    const expenseToUpdate = await Expense.findOne({ _id: expenseId });

    if (!expenseToUpdate) {
      return res.status(404).json({ message: 'Expense is not found' });
    }

    if (memberId) {
      const currentLinkedMember = await Member.findOne({ _id: expenseToUpdate.debtor, group: group._id });

      if (!currentLinkedMember) {
        return res.status(404).json({ message: 'Linked member is not found' });
      }
      currentLinkedMember.expenses = currentLinkedMember.expenses.filter(storedExpenseId => !storedExpenseId.equals(expenseToUpdate._id));
      currentLinkedMember.total_spent -= expenseToUpdate.amount;
      group.total_spent -= expenseToUpdate.amount;

      const newLinkedMember = await Member.findOne({ _id: memberId, group: group._id });

      if (!newLinkedMember) {
        return res.status(404).json({ message: 'Member to link is not found' });
      }

      newLinkedMember.total_spent += amount ?? expenseToUpdate.amount;
      newLinkedMember.expenses.push(expenseToUpdate._id);
      group.total_spent += amount ?? expenseToUpdate.amount;

      await expenseToUpdate.updateOne(payloadToUpdateExpense);
      await currentLinkedMember.save();
      await newLinkedMember.save();
      await group.save();
    } else {
      const currentLinkedMember = await Member.findOne({ _id: expenseToUpdate.debtor, group: group._id });

      if (!currentLinkedMember) {
        return res.status(404).json({ message: 'Linked member is not found' });
      }

      if (amount) {
        currentLinkedMember.total_spent -= expenseToUpdate.amount;
        currentLinkedMember.total_spent += amount;
        group.total_spent -= expenseToUpdate.amount;
        group.total_spent += amount;

        await currentLinkedMember.save();
        await group.save();
      }

      await expenseToUpdate.updateOne(payloadToUpdateExpense);
    }

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

    const member = await Member.findOne({ _id: expense.debtor });

    if (member) {
      member.expenses = member.expenses.filter(expenseId => !expenseId.equals(expense._id));
      member.total_spent -= expense.amount;
      await member.save();
    }

    if (group) {
      group.expenses = group.expenses.filter(expenseId => !expenseId.equals(expense._id));
      group.total_spent -= expense.amount;
      await group.save();
    }

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}]
