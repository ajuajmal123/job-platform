import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
dotenv.config();
import { MONGODB_URI ,APP_ORIGIN} from './constants/env';
import errorHandler from './middleware/errorHandler';
import catchError from './utils/catchError';
import authRoutes from './routes/auth.route';
import authenticate from './middleware/authenticate';
import userRoutes from './routes/user.routes';

const app=express();
const PORT=process.env.PORT||5000

//middlwares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(
    {
        origin:APP_ORIGIN,
        credentials:true
    }
));
app.use(cookieParser());

catchError(app.get('/', (req,res)=>{
   
    res.send('auth service is running');
})  );

//auth routes
app.use('/auth',authRoutes);

//protected route
app.use('/user',authenticate,userRoutes);

//errorhandler middleware
app.use(errorHandler);
//server
const serverStart= async ()=>{
try {
    await mongoose.connect(MONGODB_URI);
    console.log('DB connected successfully');
    app.listen(PORT,()=>{
        console.log(`Auth service is running on ${PORT}`);
    });
} catch (error) {
    console.log(`Faild to connect DB`,error);
    process.exit(1)
}
};

serverStart();