import verificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import userModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { oneYearfromNow } from "../utils/date";
import jwt from 'jsonwebtoken'
import { JWT_SECRET,JWT_REFRESH_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT } from "../constants/http";
export type createAccountParams={
    name:string;
    email:string;
    password:string;
    userAgent?:string
}
/* The all business logic to setup user creation */
//verify user doesn't exist
//create user
//create verification code
//send verification email
//create session 
//sign access and refresh tocken
//return user and tocken

export const createAccount= async (data:createAccountParams)=>{

    //verify user doesn't exist
const existingUser=await userModel.exists({
    email:data.email
});

appAssert(!existingUser,CONFLICT,'User already exist');

//user creation
const user=await userModel.create({
    name:data.name,
    email:data.email,
    password:data.password

});

//create verifiction code
const verificationCode= await VerificationCodeModel.create({
    userId:user._id,
    type:verificationCodeType.emailVerification,
    expairesAt:oneYearfromNow()   
});

//create session  
const session =await SessionModel.create({
    userId:user._id,
    userAgent:data.userAgent
});

//sign refresh token and access token
const refreshToken=jwt.sign(
    {sessionId:session._id},
    JWT_REFRESH_SECRET,
    {
        audience:['user'],
        expiresIn:'7d'
    }
);

const accessToken=jwt.sign(
    {
        userId:user._id,
        sessionId:session._id
    },
    JWT_SECRET,
    {
        audience:['user'],
        expiresIn:'15m'
    }
);

return {
    user,
    accessToken,
    refreshToken
}
 
// create Account 

};