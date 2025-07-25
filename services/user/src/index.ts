import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import { APP_ORIGIN, MONGODB_URI } from "./constants/env";
import userRoutes from "./routes/user.route";


const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(
    {
        origin:APP_ORIGIN,
        credentials:true,
    }
));
app.use(cookieParser());
app.use('/api/users',userRoutes);

const serverStart = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("DB connected sussessfully");
    app.listen(PORT, () => {
      console.log(`user service is litening to ${PORT}`);
    });
  } catch (error) {
    console.error('failed to connect DB',error);
    process.exit(1)
  }
};

serverStart()