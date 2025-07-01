import { CREATED, OK } from "../constants/http";
import { createAccount, loginUser } from "../services/auth.service";
import {loginSchema, registerSchema} from './auth.schema'
import catchError from "../utils/catchError";
import z from 'zod'
import { clearAuthCookies, setAuthCookies } from "../utils/cookie";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";



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
            const accessToken=req.cookies.accessToken;
            const {payload}=verifyToken(accessToken);
            if(payload){
                await SessionModel.findByIdAndDelete(payload.sessionId)
            }
            return clearAuthCookies(res).status(OK).json({
                message:'Logout Successfull'
            })
        })    

