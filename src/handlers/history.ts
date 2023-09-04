import requireJwtAuth from '../middleware/requireJwtAuth';
import { IAuthRequest } from '../types/request';
import { Response } from 'express';
import Group from '../models/Group';
import Member from '../models/Member';

export const getGroupHistory = [requireJwtAuth, async (req: IAuthRequest, res: Response) => {
  const { groupId } = req.params;
  const offset = req.query.offset as string || "0";
  const limit = req.query.limit as string || "10";

  try {
    const group = await Group.findOne({ _id: groupId, creator: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group is not found' });
    }

    const paginateResult = await Member.paginate({ _id: { $in: group.members }}, {
      page: Math.ceil(parseInt(offset) / parseInt(limit)) + 1,
      limit: parseInt(limit),
      sort: { updatedAt: -1 },
      select: 'name background_color total_spent avatar',
      populate: {
        path: 'expenses',
        select: 'amount category updatedAt',
        options: {
          sort: {
            updatedAt: -1
          }
        },
        populate: {
          path: 'category',
          select: 'name',
        }
      }
    });

    const { docs, totalDocs, totalPages, page, ...restPaginateResult } = paginateResult

    return res.status(200).json({
      items: docs,
      totalItems: totalDocs,
      limit: restPaginateResult.limit,
      totalPages,
      page,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}]
