import mongoose from 'mongoose';

// create connection to MONGODB database
const connectDB = async () => {
  try {
    // fetch env variables
    // encode the password incase it has special characters
    const { MONGODB_USERNAME, MONGODB_DATABASE, MONGODB_CLUSTER, MONGODB_USER_PASSWORD } = process.env;
    const encodedPassword = encodeURIComponent(MONGODB_USER_PASSWORD);

    // connect to mongoDB using mongoose
    const url = `mongodb+srv://${MONGODB_USERNAME}:${encodedPassword}@${MONGODB_CLUSTER}/${MONGODB_DATABASE}?retryWrites=true&w=majority`
    await mongoose.connect(url);

    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to DB:', error);
    throw error;
  }
};

export default connectDB;
