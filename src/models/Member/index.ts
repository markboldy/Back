import mongoose, { CallbackError, model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IMemberDocument, MemberModel } from './types';
import Expense from '../Expense';

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
      require: true
    },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense', index: true }],
    group: { type: Schema.Types.ObjectId, ref: 'Group', index: true },
  }, {
    timestamps: true
  }
);

memberSchema.plugin(paginate as any);

memberSchema.pre<IMemberDocument>('remove', async function (next) {
  try {
    await Expense.deleteMany({ _id: { $in: this.expenses } });

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const Member = model<IMemberDocument, PaginateModel<IMemberDocument>>('Member', memberSchema)

export default Member;
