import { CREATED, OK } from "../constants/http";
import { createAccount, loginUser } from "../services/auth.service";
import {loginSchema, registerSchema} from './auth.schema'
import catchError from "../utils/catchError";
import z from 'zod'
import { setAuthCookies } from "../utils/cookie";

const registerSchema=z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional()
}).refine((data)=>data.password===data.confirmPassword,
{
    message:'password do not matching',
    path:['confirmPassword']
});

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

