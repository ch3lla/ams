import mongoose from "mongoose";
import 'dotenv/config';

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
      console.log('Connected to MongDB');
    })
    .catch((error) => {
      console.error('Error connection to MongoDB: ', error);
    });
};

export default connectDb;