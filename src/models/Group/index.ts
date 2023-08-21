import mongoose from 'mongoose';
import { IGroup } from './types';
import { ECurrencies } from '../../types/base';

const { Schema } = mongoose;

const groupSchema = new Schema<IGroup>(
  {
    name: {
      require: true,
      type: String
    },
    currency: {
      type: String,
      default: ECurrencies.Euro
    },
    background_color: {
      type: String,
      require: true
    },
    total_spent: {
      type: Number,
      require: true
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }]
  }
);

const Group = mongoose.model('Group', groupSchema);

export default Group;
