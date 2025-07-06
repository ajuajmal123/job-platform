import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { createAccount, loginUser, refreshUserAccessToken, verifyEmail } from "../services/auth.service";
import {emailSchema, loginSchema, registerSchema, verificationCodeSchema} from './auth.schema'
import catchError from "../utils/catchError";
import z from 'zod'
import { clearAuthCookies, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookie";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";



export const registerHandler=catchError(
   //validate request
    async (req,res)=>{
     const request=registerSchema.parse({
        ...req.body,
        userAgent:req.headers['user-agent']
     }) ;

    //call service
    const { user,accessToken,refreshToken}=await createAccount(request);

    //return response
    return setAuthCookies({res,accessToken,refreshToken})  //pass tokens to cookies
     .status(CREATED)
     .json(user);

    });

    export const loginHandler=catchError(
        async (req,res)=>{
            const request=loginSchema.parse({
                ...req.body,
            userAgent:req.headers['user-agent']
            });
         
            const {accessToken,refreshToken}=await loginUser(request);
            setAuthCookies({res,accessToken,refreshToken})
            .status(OK)
            .json({message:'Login successfull'});
        });

    export const logoutHandler=catchError(
        async (req,res)=>{
            const accessToken=req.cookies.accessToken as string|undefined
            const {payload}=verifyToken(accessToken ||'');
            if(payload){
                await SessionModel.findByIdAndDelete(payload.sessionId)
            }
            return clearAuthCookies(res).status(OK).json({
                message:'Logout Successfull'
            })
        })    

export const refreshHandler=catchError(
    async (req,res)=>{
      const refreshToken=req.cookies.refreshToken as string|undefined
      appAssert(refreshToken,UNAUTHORIZED,'Refresh token Missing');
     const {accessToken,newRefreshToken}=await refreshUserAccessToken(refreshToken);
     if(newRefreshToken){
        res.cookie('refreshToken',newRefreshToken,getRefreshTokenCookieOptions())
     }
     return res
     .status(OK)
     .cookie('accessToken',accessToken,getRefreshTokenCookieOptions())
     .json({
        message:'access token refreshed'
     })
    });

export const verifyEmailHandler=catchError(
    async (req,res)=>{
    const verificationCode=verificationCodeSchema.parse(req.params.code)
    await verifyEmail(verificationCode);
    return res.status(OK).json({
        message:'Email Varified successfully'
    })
});   

export const resetPasswordHandler=catchError(
    async (req,res)=>{
     const email=emailSchema.parse(req.body.email)
})