import verificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import userModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearfromNow, thirtyDaysFromNow } from "../utils/date";
import jwt from 'jsonwebtoken'
import { JWT_SECRET,JWT_REFRESH_SECRET, APP_ORIGIN } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/http";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplate";
import { hashValue } from "../utils/bcrypt";
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

//send verify mail
const url=`${APP_ORIGIN}/email/verify/${verificationCode._id}`
await sendMail({
    to:user.email,
    ...getVerifyEmailTemplate(url),
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
       
       appAssert(isValid,UNAUTHORIZED,"Invalid Email or Password");

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
};

export const verifyEmail=async (code:string)=>{
    const validCode=await VerificationCodeModel.findOne({
        _id:code,
        type:verificationCodeType.EmailVerification,
        expairesAt:{$gt:new Date()},
    });

    appAssert(validCode,NOT_FOUND,'Invalid verification code or verification code not found');

    const updatedUser= await userModel.findByIdAndUpdate(
        validCode.userId,
        {
            verified:true
        },
        {
            new:true
        }
    );
    appAssert(updatedUser,INTERNAL_SERVER_ERROR,'faild to varify email');
    await validCode.deleteOne()
    return {
      user:updatedUser.omitPassword(),
    }
};

export const sendPasswordResetEmail= async (email:string)=>{
    const user=await userModel.findOne({email});
    appAssert(user,NOT_FOUND,'User not found');

    //to check email limit rate
    const fiveMinAgo=fiveMinutesAgo();
    const count=await VerificationCodeModel.countDocuments({
        userId:user._id,
        type:verificationCodeType.passwordReset,
        createdAt:{$gt:fiveMinAgo},
    });
    appAssert(count<=1,TOO_MANY_REQUESTS,'Too many requests,Please try again later');

    // create varification code 
    const expairesAt=oneHourFromNow()
    const verificationCode=await VerificationCodeModel.create({
        userId:user._id,
        type:verificationCodeType.passwordReset,
        expairesAt,
    });

    //send verification mail
    const url=`${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expairesAt.getTime()}`
    await sendMail({
        to:user.email,
        ...getPasswordResetTemplate(url)
    })

    return {
        url,
        email:user.email
    }
};

export type ResetParams={
    password:string;
    verificationCode:string;
}
export const resetPassword=async ({password,verificationCode}:ResetParams)=>{
   //get the verification code
    const validCode=await VerificationCodeModel.findOne({
     _id:verificationCode,
     type:verificationCodeType.passwordReset,
     expairesAt:{$gt:new Date()},
    });
    appAssert(validCode,INTERNAL_SERVER_ERROR,'Invalid verificationcode');

    //update user's password

    const updatedUser=await userModel.findByIdAndUpdate(
        validCode.userId,
        {
         password:await hashValue(password,10)
        }
    );
    appAssert(updatedUser,INTERNAL_SERVER_ERROR,'Failed to reset password');

    //delete the verification code
    await validCode.deleteOne()

    //delete all sessions
    await SessionModel.deleteMany({
        userId:updatedUser._id
    });

    return {
        user:updatedUser.omitPassword(),
    }

}