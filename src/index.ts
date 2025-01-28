import * as dotenv from "dotenv";
import * as express from "express";
import * as cors from 'cors';
import * as bodyParser from "body-parser";

import connectDB from "./config/db";
import productRouter from "./routes/productRoute";
import userRouter from "./routes/userRoute";
import { errorMiddleware } from "./middlewares/errorMiddleware";

dotenv.config();

const server = async () => {
  try {
    // connect to database
    await connectDB()

    // Create Express app
    const app = express();

    // Use cors middleware
    app.use(
      cors({
        credentials: true,
        origin: "*",
      })
    );

    // Parse incoming request bodies
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // routes
    app.use('/api', userRouter);
    app.use('/api', productRouter);

  
    // error middleware, handles all endpoint errors
    app.use(errorMiddleware);

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

server();