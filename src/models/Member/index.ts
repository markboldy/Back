import mongoose, { CallbackError, model, PaginateModel, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IMemberDocument, MemberModel } from './types';
import Expense from '../Expense';
import { unlinkAvatar } from '../../services/upload';
import Group from '../Group';

const { Schema } = mongoose;

const memberSchema = new Schema<IMemberDocument, MemberModel>(
  {
    name: {
      require: true,
      type: String
    },
    background_color: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      require: true,
      default: 'avatar_placeholder.png',
    },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense', index: true }],
    total_spent: {
      type: Number,
      require: true
    },
    group: { type: Schema.Types.ObjectId, ref: 'Group', index: true },
  }, {
    timestamps: true
  }
);

memberSchema.plugin(paginate as any);

memberSchema.pre(['findOneAndRemove', 'remove', 'findOneAndDelete', 'deleteOne'], async function (next) {
  try {
    const memberDoc: IMemberDocument = await this.model.findOne(this.getQuery());

    if (!memberDoc) {
      return next();
    }

    await unlinkAvatar(memberDoc.avatar);
    await Expense.deleteMany({ _id: { $in: memberDoc.expenses } });

    const group = await Group.findOne({ _id: memberDoc.group });

    if (group) {
      group.members_total -= 1;
      group.members = group.members.filter(memberId => memberId !== memberDoc._id);
      await group.save();
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

memberSchema.pre(['deleteMany'], async function (next) {
  try {
    const memberDocs: IMemberDocument[] = await this.model.find(this.getQuery());

    if (!memberDocs || memberDocs.length === 0) {
      return next();
    }

    const groups = await Group.find({ _id: { $in: memberDocs.map(member => member.group) } });
    const membersIdsSet = new Set<Types.ObjectId>(memberDocs.map(member => member._id));

    await Promise.all([
      ...memberDocs.map(async memberDoc => {
      await unlinkAvatar(memberDoc.avatar);
      await Expense.deleteMany({ _id: { $in: memberDoc.expenses } });
    }),
      ...groups.map(async group => {
        group.members_total -= 1;
        group.members = group.members.filter(memberId => !membersIdsSet.has(memberId));
        await group.save();
      })
    ]);

    next();
  } catch (error) {
    next(error as CallbackError);
  }
})

const Member = model<IMemberDocument, PaginateModel<IMemberDocument>>('Member', memberSchema)

export default Member;
