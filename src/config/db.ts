import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    const mongoDBUrl: string = process.env.MONGODB_URI;
    console.log("MONGODB_URIk",mongoDBUrl);
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
