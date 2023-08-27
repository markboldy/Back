import { Response } from 'express';
import Joi, { ValidationResult } from 'joi';
import requireJwtAuth from '../middleware/requireJwtAuth';
import { IAuthRequest } from '../types/request';
import Member from '../models/Member';
import Group from '../models/Group';
import { IMemberDocument } from '../models/Member/types';
import { unlinkAvatar, upload } from '../services/upload';
import { sanitizeObject } from '../utils/utils';
import { DEFAULT_AVATAR_NAME } from '../utils/constants';

export const getGroupMembers = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  const { groupId } = req.params;
  const offset = req.query.offset as string || "0";
  const limit = req.query.limit as string || "10";

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id })

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const paginateResult = await Member.paginate({ _id: { $in: group.members }}, {
      page: Math.ceil(parseInt(offset) / parseInt(limit)) + 1,
      limit: parseInt(limit),
    });

    const { docs, totalDocs, totalPages, page, ...restPaginateResult } = paginateResult

    res.status(200).json({
      totalItems: totalDocs,
      items: docs.map((memberDoc: IMemberDocument) => ({
        name: memberDoc.name,
        background_color: memberDoc.background_color,
        avatar: memberDoc.avatar,
        total_spent: memberDoc.total_spent,
      })),
      limit: restPaginateResult.limit,
      totalPages,
      page,
    })

  } catch(error) {
    res.status(500).json({ error: error });
  }
}];

interface ICreateMemberReqBody {
  name: string;
  background_color: string;
  avatar: string;
}

export const validateCreateMemberBody = (body: ICreateMemberReqBody): ValidationResult<ICreateMemberReqBody> => {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    background_color: Joi.string().hex().required(),
    avatar: Joi.any()
  };

  return Joi.validate(body, schema);
};

export const addGroupMember = [requireJwtAuth, upload.single('avatar'), async (req: IAuthRequest, res: Response) => {
  const { groupId } = req.params;
  const avatarFileName = req.file?.filename;

  const { error } = validateCreateMemberBody(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const body: ICreateMemberReqBody = req.body;

    const member = await new Member({
      name: body.name,
      background_color: body.background_color,
      avatar: avatarFileName,
      expenses: [],
      total_spent: 0,
      group: group._id
    }).save();

    group.members.push(member._id);

    await group.save();

    return res.status(201).json({ message: 'Success' });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}];

interface IPatchMemberReqBody {
  name?: string;
  background_color?: string;
  avatar?: string;
}

export const validatePatchMemberBody = (body: IPatchMemberReqBody): ValidationResult<IPatchMemberReqBody> => {
  const schema = {
    name: Joi.string().min(2).max(30),
    background_color: Joi.string().hex(),
    avatar: Joi.any()
  };

  return Joi.validate(body, schema);
};

export const patchGroupMember = [requireJwtAuth, upload.single('avatar'), async (req: IAuthRequest, res: Response) => {
  const { groupId, memberId } = req.params;
  const avatarFileName = req.file?.filename;

  const { error } = validatePatchMemberBody(req.body);
  const { name, background_color } = req.body as IPatchMemberReqBody;

  if ((!name && !background_color && !avatarFileName) || error) {
    return res.status(400).json({ message: error ? error.details[0].message : "Valid body fields weren't provided" });
  }

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const member = await Member.findOne({ _id: memberId, group: group._id });

    if (!member) {
      return res.status(404).json({ message: 'Member is not found' });
    }

    if (avatarFileName && member.avatar !== DEFAULT_AVATAR_NAME) {
      await unlinkAvatar(member.avatar);
    }

    await member.updateOne(sanitizeObject({
      name,
      background_color,
      avatar: avatarFileName
    }))

    return res.status(200).json({ message: 'Success'});
  } catch (error) {
    res.status(500).json({ error: error });
  }
}];

export const deleteGroupMember = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  const { groupId, memberId } = req.params;

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const member = await Member.findOneAndDelete({ _id: memberId, group: group._id });

    if (!member) {
      return res.status(404).json({ message: 'Member is not found' });
    }

    return res.status(200).json({ message: 'Success'});
  } catch (error) {
    res.status(500).json({ error: error });
  }
}];

