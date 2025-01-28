import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const { MONGODB_USERNAME, MONGODB_DATABASE, MONGODB_CLUSTER, MONGODB_USER_PASSWORD } = process.env;
    const encodedPassword = encodeURIComponent(MONGODB_USER_PASSWORD);

    const url = `mongodb+srv://${MONGODB_USERNAME}:${encodedPassword}@${MONGODB_CLUSTER}/${MONGODB_DATABASE}?retryWrites=true&w=majority`
    await mongoose.connect(url);

    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
