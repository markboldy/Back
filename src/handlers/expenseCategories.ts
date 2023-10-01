import { IAuthRequest } from '../types/request';
import { Response } from 'express';
import ExpenseCategory from '../models/ExpenseCategory';
import requireJwtAuth from '../middleware/requireJwtAuth';
import Joi, { ValidationResult } from 'joi';
import Expense from '../models/Expense';
import { BASIC_CATEGORIES_NAMES } from '../utils/constants';

export const getExpenseCategories =  [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  try {
    const categories = await ExpenseCategory.find();

    return res.status(200).json({ categories: categories.map(({ id, name }) => ({
        id,
        name
      }))
    });
  } catch(error) {
    return res.status(500).json({ error: error })
  }
}];

interface IPostNewCategoryBody {
  name: string;
};

const validatePostNewCategoryBody = (body: IPostNewCategoryBody): ValidationResult<IPostNewCategoryBody> => {
  const schema = {
    name: Joi.string().required().min(2).max(20),
  };

  return Joi.validate(body, schema);
}

export const postNewCategory =  [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  try {
    const { error } = validatePostNewCategoryBody(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const category = await ExpenseCategory.findOne({ name: req.body.name });

    if (category) {
      return res.status(409).json({ message: 'Category already exist' });
    }

    const newCategory = await new ExpenseCategory({
      name: req.body.name
    }).save();

    return res.status(200).json({ message: 'Success', category: { id: newCategory._id, name: newCategory.name } });
  } catch(error) {
    return res.status(500).json({ error: error })
  }
}];

export const deleteCategory = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  try {
    const expenseWithThisCategory = await Expense.findOne({ category: req.params.id });

    if (expenseWithThisCategory) {
      return res.status(409).json({ message: "Can't delete category because it's related to some expense" });
    }

    const categoryToDelete = await ExpenseCategory.findOne({ _id: req.params.id });

    if (categoryToDelete && BASIC_CATEGORIES_NAMES.includes(categoryToDelete.name)) {
      return res.status(409).json({ message: "Can't delete basic category" });
    }

    if (categoryToDelete) {
      await categoryToDelete.delete();
    }

    return res.status(204).json({ message: 'Success' });
  } catch(error) {
    return res.status(500).json({ error: error })
  }
}]
