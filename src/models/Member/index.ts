import mongoose, { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IMemberDocument, MemberModel } from './types';

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

const Member = model<IMemberDocument, PaginateModel<IMemberDocument>>('Member', memberSchema)

export default Member;
