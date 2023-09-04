import mongoose from 'mongoose';
import { seedDb } from './utils/seed/seedDb';

const isProduction = process.env.NODE_ENV === 'production';
const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

const connect = async () => {
  if (dbConnection) {
    await mongoose
      .connect(dbConnection, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log('DB connected');

        return mongoose.connection.db.listCollections().toArray()
      }).then((collections) => {
      if (collections.length === 0) {
        seedDb()
      }
    })
      .catch((err) => console.log(err));
  } else {
    console.error("DB connection uri wasn't provided");
  }
}

export default connect;
