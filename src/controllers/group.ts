import Joi, { ValidationResult } from 'joi';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import requireJwtAuth from '../middleware/requireJwtAuth';
import { IUser } from '../models/User/types';
import Group from '../models/Group';
import { ECurrencies } from '../types/base';
import { IGroupDocument } from '../models/Group/types';
import Member from '../models/Member';
import Expense from '../models/Expense';
import { IMemberDocument } from '../models/Member/types';
import { sanitizeObject } from '../utils/utils';

console.log({Member, Expense});
interface ICustomRequest extends Request {
  user: IUser
}

export const getAllGroups = [requireJwtAuth, async (req: ICustomRequest, res: Response) => {
  const offset = req.query.offset as string || "0";
  const limit = req.query.limit as string || "10";

  try {
    const paginateResult = await Group.paginate({ creator: req.user._id }, {
      page: Math.ceil(parseInt(offset) / parseInt(limit)) + 1,
      limit: parseInt(limit),
    });

    const { docs, totalDocs, totalPages, page, ...restPaginateResult } = paginateResult

    res.status(200).json({
      totalItems: totalDocs,
      items: docs.map((groupDoc: IGroupDocument) => ({
        id: groupDoc._id,
        name: groupDoc.name,
        background_color: groupDoc.background_color,
        currency: groupDoc.currency,
        members_total: groupDoc.members_total,
        total_spent: groupDoc.total_spent,
      })),
      limit: restPaginateResult.limit,
      totalPages,
      page,
    })
  } catch(error) {
   res.status(500).json({ error });
  }
}];

export const getGroupById = [requireJwtAuth, async (req: ICustomRequest, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'id param is missing' });
  }

  try {
    const group = await Group.findOne({ _id: req.params.id, creator: req.user._id })
      .populate({
        path: 'members',
        perDocumentLimit: 5,
        transform: (doc: IMemberDocument, id: Types.ObjectId) => {
          if (!doc) {
            return id;
          }

          return {
            id: doc._id,
            name: doc.name,
            background_color: doc.background_color,
            avatar: doc.avatar,
            expenses: doc.expenses
          }
        },
        populate: {
          path: 'expenses',
          select: 'amount'
        }
      });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    return res.status(200).json({ group });
  } catch(error: any) {
    console.log({error});
    res.status(500).json({ error: error.error });
  }
}];

interface ICreateGroupReqBody {
  name: string;
  background_color: string;
}

export const validateCreateGroupBody = (body: ICreateGroupReqBody): ValidationResult<ICreateGroupReqBody> => {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    background_color: Joi.string().required()
  };

  return Joi.validate(body, schema);
};

export const createGroup = [requireJwtAuth, async (req: ICustomRequest, res: Response) => {
  const { error } = validateCreateGroupBody(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const body: ICreateGroupReqBody = req.body;

  try {
    const group = await new Group({
      name: body.name,
      background_color: body.background_color,
      creator: req.user._id,
      currency: ECurrencies.Euro,
      total_spent: 0,
      members: [],
      members_total: 0,
      expenses: []
    }).save();

    return res.status(201).json({
      group
    })
  } catch (error) {
    return res.status(500).json({ error })
  }
}]

interface IPatchGroupReqBody {
  name?: string;
  background_color?: string;
  currency?: boolean;
}

const validatePatchGroupBody = (body: IPatchGroupReqBody): ValidationResult<IPatchGroupReqBody> => {
  const schema = {
    name: Joi.string().min(2).max(30),
    background_color: Joi.string().hex(),
    currency: Joi.string().valid(ECurrencies.Euro, ECurrencies.Dollar, ECurrencies.Ruble)
  };

  return Joi.validate(body, schema);
}

export const patchGroupById = [requireJwtAuth, async (req: ICustomRequest, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'id param is missing' });
  }

  const { name, background_color, currency } = req.body;
  const { error } = validatePatchGroupBody(req.body);

  if ((!name && !background_color && !currency) || error) {
    return res.status(400).json({ message: error ? error.details[0].message : "Valid body fields wasn't provided" });
  }

  try {
    const group = await Group.findOneAndUpdate({ _id: id, creator: req.user._id }, sanitizeObject(req.body))

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json({ message: 'Success' });
  } catch(error) {
    return res.status(500).json({ error })
  }
}]

export const deleteGroupById = [requireJwtAuth, async (req: ICustomRequest, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'id param is missing' });
  }

  try {
    const group = await Group.findOneAndRemove({ _id: id, creator: req.user._id })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(204).json({ message: 'Group successfully deleted' })
  } catch(error) {
    return res.status(500).json({ error })
  }
}]
