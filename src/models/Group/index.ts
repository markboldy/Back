import { model, Schema, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { GroupModel, IGroupDocument } from './types';
import { ECurrencies } from '../../types/base';

const groupSchema = new Schema<IGroupDocument, GroupModel>(
  {
    name: {
      require: true,
      type: String
    },
    creator: { type: Schema.Types.ObjectId, ref: 'Member', index: true },
    currency: {
      type: String,
      default: ECurrencies.Euro
    },
    background_color: {
      require: true,
      type: String,
    },
    total_spent: {
      type: Number,
      require: true
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'Member', index: true }],
    members_total: {
      type: Number,
      require: true
    },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense', index: true }],
  },
  {
    timestamps: true
  }
);

groupSchema.plugin(paginate as any);

const Group = model<IGroupDocument, PaginateModel<IGroupDocument>>('Group', groupSchema);

export default Group;
