import verificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import userModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { ONE_DAY_MS, oneYearfromNow, thirtyDaysFromNow } from "../utils/date";
import jwt from 'jsonwebtoken'
import { JWT_SECRET,JWT_REFRESH_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
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
const userId=user._id
//create verifiction code
const verificationCode= await VerificationCodeModel.create({
    userId:user._id,
    type:verificationCodeType.EmailVerification,
    expairesAt:oneYearfromNow()   
});

//create session  
const session =await SessionModel.create({
    userId,
    userAgent:data.userAgent
});

//sign refresh token and access token
const refreshToken=signToken(
    {sessionId:session._id},
   refreshTokenSignOptions,
);

const accessToken=signToken({
    userId,
    sessionId:session._id
})

return {
    user:user.omitPassword(),
    accessToken,
    refreshToken
}

};
export type loginParams={
  
email:string;
password:string;
userAgent?:string;
}
export  const loginUser= async ({email,password,userAgent}:loginParams)=>{
       //get user by email
       const user=await userModel.findOne({email});
       appAssert(user,UNAUTHORIZED,"Invalid Email or Password");

       //validate password from the request
       const isValid=await user.comparePassword(password);
       appAssert(user,UNAUTHORIZED,"Invalid Email or Password");

       const userId=user._id;
       //create session
      const session =await SessionModel.create({
        userId,
        userAgent,
      });

      const sessionInfo={
        sessionId:session._id,
      };

      const refreshToken=signToken(
              sessionInfo,refreshTokenSignOptions,
      );
      const accessToken=signToken({
        ...sessionInfo,
        userId
});

      //return user and tokens
      return {
      user:user.omitPassword(),
      accessToken,
      refreshToken
      }
}

export const refreshUserAccessToken=async (refreshToken:string)=>{
    const{
        payload
    }=verifyToken<RefreshTokenPayload>(refreshToken,{
        secret:refreshTokenSignOptions.secret,
    })
    appAssert(payload,UNAUTHORIZED,'Invalid Refresh Token');

    const session=await SessionModel.findById(payload.sessionId)
    const now=Date.now()
    appAssert(session&&session.expairesAt.getTime()>now,
    UNAUTHORIZED,
    'Session Expaired')

    //refresh the session if it expaires in 24 hours
   const sessionNeedsRefresh=session.expairesAt.getTime()-now<=ONE_DAY_MS

   if(sessionNeedsRefresh){
    session.expairesAt=thirtyDaysFromNow();
    await session.save();
   };

    const newRefreshToken=sessionNeedsRefresh?signToken(
        {
            sessionId:session._id
        },
        refreshTokenSignOptions
    ):undefined;

    const accessToken=signToken(
        {
            userId:session.userId,
            sessionId:session._id
        }
    );
    return{
        accessToken,
        newRefreshToken,
    }
}