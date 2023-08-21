import mongoose from 'mongoose';
import { IMember } from './types';

const { Schema } = mongoose;

const memberSchema = new Schema<IMember>(
  {
    name: {
      require: true,
      type: String
    },
    background_color: {
      type: String,
    },
    avatar: {
      type: String,
      require: true
    }
  }
);

const Member = mongoose.model('Member', memberSchema);

export default Member;
